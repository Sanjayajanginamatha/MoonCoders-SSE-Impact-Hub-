package com.sse.impacthub;

import com.sse.impacthub.entity.Ngo;
import com.sse.impacthub.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Seeds the NGO table on first startup.
 * Runs only if the table is empty — safe to leave in production.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private NgoRepository ngoRepository;

    @Override
    public void run(String... args) {
        if (ngoRepository.count() > 0) return; // already seeded

        List<Ngo> ngos = Arrays.asList(
            ngo("Akshaya Patra Foundation",
                "Providing mid-day meals to school children across India to eliminate classroom hunger and facilitate education.",
                "Feeds 2 Million+ children daily.",
                5000000.0, 3750000.0,
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80",
                List.of("Zero Hunger", "Good Health")),

            ngo("Teach For India",
                "Building a movement of leaders who will end educational inequity in India.",
                "Reached 32,000+ students across 260 schools.",
                2000000.0, 1200000.0,
                "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80",
                List.of("Quality Education", "Reduced Inequalities")),

            ngo("Sanjivani Health Trust",
                "Deploying mobile health clinics to remote rural areas providing free medical checkups and medicines.",
                "Treated 50,000+ patients in rural districts.",
                1000000.0, 800000.0,
                "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80",
                List.of("Good Health", "Clean Water")),

            ngo("Green Earth Initiative",
                "Large scale reforestation and biodiversity conservation in degraded landscapes.",
                "Planted 1 Million+ native tree species.",
                6000000.0, 4500000.0,
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80",
                List.of("Climate Action", "Life on Land")),

            ngo("Goonj",
                "Undertaking disaster relief, humanitarian aid, and community development using urban discard as a tool.",
                "Channelized 5000+ tons of material for rural development.",
                4000000.0, 2800000.0,
                "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=500&q=80",
                List.of("No Poverty", "Reduced Inequalities")),

            ngo("HelpAge India",
                "Working for the cause and care of disadvantaged older persons to improve their quality of life.",
                "Supported 1.5 Million+ elderly through healthcare and pensions.",
                2500000.0, 1500000.0,
                "https://images.unsplash.com/photo-1513159446162-54eb8bdaa79ea?w=500&q=80",
                List.of("Good Health", "Reduced Inequalities")),

            ngo("Smile Foundation",
                "Promoting education and healthcare for underprivileged children and empowering women.",
                "Provided education to over 1.5 Million children annually.",
                4500000.0, 3100000.0,
                "https://images.unsplash.com/photo-1603525547614-72b14e9f5641?w=500&q=80",
                List.of("Quality Education", "Good Health")),

            ngo("Pratham",
                "Innovative learning organization created to improve the quality of education in India.",
                "Reaches over 5 Million children and youth annually.",
                8000000.0, 5500000.0,
                "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&q=80",
                List.of("Quality Education")),

            ngo("Kailash Satyarthi Children's Foundation",
                "Working globally to eradicate child labor, slavery, and trafficking while ensuring child rights.",
                "Freed and rehabilitated over 100,000 children from child labor.",
                5000000.0, 4200000.0,
                "https://images.unsplash.com/photo-1610444315263-d1df5d4dfc87?w=500&q=80",
                List.of("Peace and Justice", "Quality Education")),

            ngo("WaterAid India",
                "Transforming lives by improving access to safe water, hygiene and sanitation in the poorest communities.",
                "Provided clean water to over 2 Million people in rural areas.",
                3000000.0, 1800000.0,
                "https://images.unsplash.com/photo-1536939459926-301728717817?w=500&q=80",
                List.of("Clean Water", "Sanitation")),

            ngo("CRY (Child Rights and You)",
                "Working to ensure that all children have basic rights including education, healthcare, and protection.",
                "Impacted the lives of over 3 Million children across 19 states.",
                4000000.0, 2900000.0,
                "https://images.unsplash.com/photo-1542810634-71277d95dc8c?w=500&q=80",
                List.of("Quality Education", "Reduced Inequalities")),

            ngo("Oxfam India",
                "A movement of people working together to end the injustice of poverty and inequality.",
                "Assisted over 1.2 Million people through disaster response and poverty alleviation.",
                6000000.0, 3600000.0,
                "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=80",
                List.of("No Poverty", "Gender Equality")),

            ngo("WWF India",
                "Leading conservation organization working to protect endangered species and their habitats.",
                "Conserved 50+ critical wildlife landscapes across the country.",
                10000000.0, 6800000.0,
                "https://images.unsplash.com/photo-1564750975191-0ed807751f3b?w=500&q=80",
                List.of("Climate Action", "Life on Land")),

            ngo("Sewa Rural",
                "Providing comprehensive health care and rural development programs focusing on women and children.",
                "Delivered primary health care to 2500+ tribal villages.",
                1500000.0, 850000.0,
                "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&q=80",
                List.of("Good Health", "Gender Equality")),

            ngo("Magic Bus",
                "Equips children and young people with skills and knowledge to overcome poverty.",
                "Placed 100,000+ youth in sustainable livelihood opportunities.",
                3500000.0, 2400000.0,
                "https://images.unsplash.com/photo-1526976663112-005080928373?w=500&q=80",
                List.of("Quality Education", "Decent Work")),

            ngo("Agastya International Foundation",
                "Sparks curiosity and nurtures creativity among disadvantaged children through hands-on science education.",
                "Reached 12 Million+ children with mobile science vans.",
                2800000.0, 1750000.0,
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
                List.of("Quality Education", "Industry, Innovation")),

            ngo("Barefoot College",
                "Connecting rural communities to solar energy, water, education, and professions by empowering women.",
                "Trained 3,000+ women as solar engineers electrifying 1,500 villages.",
                4500000.0, 3300000.0,
                "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&q=80",
                List.of("Quality Education", "Affordable Energy")),

            ngo("Salaam Baalak Trust",
                "Provides support services and safe shelters for street and working children.",
                "Rescued and rehabilitated over 130,000 street children.",
                1500000.0, 950000.0,
                "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&q=80",
                List.of("No Poverty", "Zero Hunger")),

            ngo("Naandi Foundation",
                "Tackling poverty through initiatives in safe drinking water, agriculture, and girls' education.",
                "Ensured safe drinking water for 5 Million+ people.",
                3000000.0, 2100000.0,
                "https://images.unsplash.com/photo-1504951478201-d70377484df7?w=500&q=80",
                List.of("Zero Hunger", "Clean Water")),

            ngo("Wildlife SOS",
                "Protecting and conserving India's natural heritage, forests, and wildlife wealth.",
                "Rescued and rehabilitated over 600 dancing bears.",
                2000000.0, 1650000.0,
                "https://images.unsplash.com/photo-1564750438137-b956037a34bd?w=500&q=80",
                List.of("Life on Land", "Climate Action")),

            ngo("Bhumi",
                "One of India's largest independent youth volunteer non-profit organizations.",
                "Engaged 30,000+ volunteers in educating 25,000 children.",
                1200000.0, 550000.0,
                "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&q=80",
                List.of("Quality Education", "Climate Action")),

            ngo("Snehalaya",
                "Providing shelter, education, and healthcare for women and children affected by HIV/AIDS and violence.",
                "Supported over 20,000 beneficiaries annually in rehabilitation.",
                1800000.0, 1100000.0,
                "https://images.unsplash.com/photo-1518133501308-4171dfd46817?w=500&q=80",
                List.of("Good Health", "Reduced Inequalities")),

            ngo("Habitat for Humanity India",
                "Building homes and providing sanitation facilities to ensure everyone has a decent place to live.",
                "Built or repaired homes for over 38 Million people globally.",
                7000000.0, 4900000.0,
                "https://images.unsplash.com/photo-1512591290618-904e04936827?w=500&q=80",
                List.of("Sustainable Cities", "No Poverty")),

            ngo("Udayan Care",
                "Providing a family-like environment for orphaned and vulnerable children.",
                "Empowered 25,000+ young women through higher education fellowships.",
                1500000.0, 820000.0,
                "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80",
                List.of("Quality Education", "Reduced Inequalities"))
        );

        ngoRepository.saveAll(ngos);
        System.out.println("✅ NGO data seeded: " + ngos.size() + " organizations loaded into database.");
    }

    private Ngo ngo(String name, String description, String impact,
                    Double target, Double raised, String imageUrl, List<String> sdgs) {
        Ngo n = new Ngo();
        n.setName(name);
        n.setDescription(description);
        n.setImpactMetrics(impact);
        n.setTargetAmount(target);
        n.setRaisedAmount(raised);
        n.setImageUrl(imageUrl);
        n.setIs80gEligible(true);
        n.setSdgTags(sdgs);
        return n;
    }
}
