import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { TIERS, getTierInfo } from '../utils/gamification';
import { Trophy, CheckCircle, Lock, ArrowRight } from 'lucide-react';

export default function Rank({ user }) {
  const points = user?.impactPoints || 0;
  const { currentTier, nextTier, pointsToNext } = getTierInfo(points);

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-secondary">Your Impact Rank</h2>
          </div>
          <p className="text-gray-600 mb-8">Climb the ranks by investing in NGOs and engaging with the platform. Higher ranks unlock exclusive benefits and voting rights.</p>
          
          {/* Current Status Overview */}
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm text-5xl">
                {currentTier.icon}
              </div>
              <div>
                <p className="text-blue-100 font-medium">Current Rank</p>
                <h3 className="text-3xl font-bold">{currentTier.name}</h3>
                <p className="text-sm mt-1 bg-white/10 inline-block px-3 py-1 rounded-full">{points.toLocaleString()} Total Impact Points</p>
              </div>
            </div>
            
            {nextTier ? (
              <div className="bg-white/10 p-4 rounded-xl text-center min-w-[200px] border border-white/20">
                <p className="text-sm text-blue-100 mb-1">Points to {nextTier.name}</p>
                <p className="text-2xl font-bold">{pointsToNext.toLocaleString()}</p>
                <Link to="/dashboard" className="text-xs bg-white text-primary px-3 py-1.5 rounded-full mt-3 inline-flex items-center gap-1 hover:bg-blue-50 transition-colors font-bold">
                  Earn Points <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="bg-white/10 p-4 rounded-xl text-center border border-white/20">
                <p className="text-lg font-bold">Maximum Rank Achieved!</p>
                <p className="text-sm text-blue-100 mt-1">You are a true impact leader.</p>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-secondary mb-6">Rank Progression Journey</h3>

          {/* Vertical Roadmap */}
          <div className="relative pl-4 md:pl-0">
            {/* The vertical connecting line */}
            <div className="absolute left-11 md:left-24 top-10 bottom-10 w-1 bg-gray-200 dark:bg-gray-700 z-0 rounded-full"></div>
            
            <div className="space-y-6 relative z-10">
              {[...TIERS].reverse().map((tier, index) => {
                const isAchieved = points >= tier.minPoints;
                const isCurrent = currentTier.name === tier.name;
                const isNext = nextTier?.name === tier.name;
                
                return (
                  <div 
                    key={tier.name} 
                    className={`flex items-center gap-4 md:gap-8 transition-all duration-300 ${
                      !isAchieved && !isNext ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                    {/* Points Requirement (Hidden on very small screens) */}
                    <div className="hidden md:block w-16 text-right">
                      <p className={`text-sm font-bold ${isAchieved ? 'text-primary' : 'text-gray-400'}`}>
                        {tier.minPoints.toLocaleString()}+
                      </p>
                      <p className="text-xs text-gray-500">pts</p>
                    </div>

                    {/* Icon Node on the Line */}
                    <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-md border-4 ${
                      isCurrent 
                        ? 'bg-white border-primary ring-4 ring-primary/20 z-10 scale-110' 
                        : isAchieved 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                    }`}>
                      {isAchieved && !isCurrent ? <CheckCircle className="w-6 h-6" /> : tier.icon}
                    </div>

                    {/* Tier Content Card */}
                    <div className={`flex-1 card p-5 ${isCurrent ? 'border-primary ring-1 ring-primary shadow-md' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-lg font-bold ${tier.color}`}>{tier.name} Tier</h4>
                          {isCurrent && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">You are here</span>}
                          {isNext && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Next Target</span>}
                        </div>
                        {!isAchieved && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md w-fit">
                            <Lock className="w-3 h-3" /> Requires {tier.minPoints.toLocaleString()} pts
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {tier.name === 'Bronze' && <p>Starter tier. Begin your impact journey.</p>}
                        {tier.name === 'Silver' && <p>Unlock detailed NGO impact reports and priority support.</p>}
                        {tier.name === 'Gold' && <p>Get early access to new ZCZP bonds and exclusive webinars.</p>}
                        {tier.name === 'Platinum' && <p>Join the elite advisory board and vote on platform initiatives.</p>}
                      </div>
                      
                      {isNext && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex justify-between text-xs mb-1 font-medium">
                            <span className="text-primary">Progress to {tier.name}</span>
                            <span className="text-gray-500">{points.toLocaleString()} / {tier.minPoints.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${Math.min(100, (points / tier.minPoints) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
