package com.skillmint.config;

import com.skillmint.entity.*;
import com.skillmint.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final InstructorRepository instructorRepo;
    private final CourseRepository courseRepo;
    private final CourseLessonRepository courseLessonRepo;
    private final UserRepository userRepo;
    private final ReviewRepository reviewRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verifying and seeding SkillMint demo database...");

        seedCategories();
        List<Instructor> instructors = seedInstructors();
        List<User> demoStudents = seedDemoUsers();
        seedAdminUser();
        List<Course> courses = seedCourses(instructors);
        seedLessonsAndReviews(courses, demoStudents);

        log.info("SkillMint demo data initialization completed successfully with {} courses.", courses.size());
    }

    private void seedCategories() {
        List<Category> categoriesToSeed = List.of(
                cat("Java", "java", "Java programming, OOP, and enterprise backend engineering", "Coffee", "TECHNOLOGY", 1),
                cat("Spring Boot", "spring-boot", "Spring Boot microservices, REST APIs, and Cloud Security", "Layers", "TECHNOLOGY", 2),
                cat("Web Development", "web-development", "Full-stack web application development with modern frameworks", "Globe", "TECHNOLOGY", 3),
                cat("React", "react", "React, TypeScript, Redux Toolkit, and frontend architecture", "Atom", "TECHNOLOGY", 4),
                cat("JavaScript", "javascript", "Modern ES6+ JavaScript, async programming, and engine internals", "Code", "TECHNOLOGY", 5),
                cat("Node.js", "nodejs", "Backend development with Node.js, Express, and async microservices", "Server", "TECHNOLOGY", 6),
                cat("Python", "python", "Python programming, automation scripts, and core computer science", "Code2", "TECHNOLOGY", 7),
                cat("Data Science", "data-science", "Data analysis, Pandas, SQL visualization, and statistical modeling", "BarChart2", "TECHNOLOGY", 8),
                cat("Machine Learning", "machine-learning", "Artificial intelligence algorithms, PyTorch, and deep neural networks", "Brain", "TECHNOLOGY", 9),
                cat("Cloud Computing", "cloud-computing", "AWS infrastructure, serverless architecture, and cloud deployment", "Cloud", "TECHNOLOGY", 10),
                cat("DevOps", "devops", "Docker containerization, Kubernetes orchestration, and CI/CD automation", "Settings", "TECHNOLOGY", 11),
                cat("Cybersecurity", "cybersecurity", "Security fundamentals, ethical hacking, network defense, and cryptography", "Shield", "TECHNOLOGY", 12),
                cat("Database & SQL", "sql-db", "Relational database design, MySQL, PostgreSQL, and complex query optimization", "Database", "TECHNOLOGY", 13),
                cat("System Architecture", "system-design", "Distributed systems design, high scalability, and microservices patterns", "Cpu", "TECHNOLOGY", 14),

                cat("Business Management", "business-management", "Core business strategy, organizational leadership, and management principles", "Briefcase", "MANAGEMENT", 1),
                cat("Leadership", "leadership", "Executive communication, team motivation, and leadership development", "Users", "MANAGEMENT", 2),
                cat("Marketing", "marketing", "Digital marketing strategies, SEO, content growth, and brand strategy", "TrendingUp", "MANAGEMENT", 3),
                cat("Finance", "finance", "Corporate financial analysis, accounting principles, and valuation modeling", "DollarSign", "MANAGEMENT", 4),
                cat("Project Management", "project-management", "Agile methodology, Scrum Framework, and PMP project management", "ClipboardList", "MANAGEMENT", 5),
                cat("Entrepreneurship", "entrepreneurship", "Startup creation, business models, funding, and venture scaling", "Rocket", "MANAGEMENT", 6),
                cat("Product Management", "product-management", "Product strategy, user discovery, feature prioritization, and launch roadmaps", "Package", "MANAGEMENT", 7),
                cat("Human Resources", "human-resources", "Talent acquisition, HR analytics, performance management, and organizational culture", "UserCheck", "MANAGEMENT", 8),
                cat("Sales & CRM", "sales-crm", "B2B sales strategy, negotiation, customer relationship management, and deal closing", "PhoneCall", "MANAGEMENT", 9),
                cat("Communication Skills", "communication-skills", "Professional negotiation, public speaking, and workplace communication", "MessageSquare", "MANAGEMENT", 10),
                cat("Business Operations", "business-operations", "Operations strategy, supply chain management, risk governance, and process optimization", "Activity", "MANAGEMENT", 11)
        );

        int count = 0;
        for (Category cat : categoriesToSeed) {
            if (categoryRepo.findBySlug(cat.getSlug()).isEmpty()) {
                categoryRepo.save(cat);
                count++;
            }
        }
        if (count > 0) {
            log.info("Seeded {} new categories into database", count);
        }
    }

    private List<Instructor> seedInstructors() {
        List<Instructor> targetInstructors = List.of(
                Instructor.builder()
                        .name("Ashwani Kumar")
                        .designation("Senior Java Architect & Backend Educator")
                        .bio("Senior Java developer and instructor specializing in enterprise backend architecture, Spring Boot, microservices, and distributed cloud systems.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-ashwani-kumar")
                        .yearsOfExperience(10)
                        .rating(4.8)
                        .totalStudents(18500)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Priya Sharma")
                        .designation("Data Scientist & AI Specialist")
                        .bio("Data scientist and ML educator focused on Python, machine learning algorithms, deep learning models, and practical data workflows.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-priya-sharma")
                        .yearsOfExperience(8)
                        .rating(4.9)
                        .totalStudents(15200)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Rajesh Mehta")
                        .designation("Management Consultant & Business Educator")
                        .bio("Business and management educator specializing in leadership development, corporate strategy, agile project execution, and organizational design.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-rajesh-mehta")
                        .yearsOfExperience(12)
                        .rating(4.7)
                        .totalStudents(11800)
                        .totalCourses(7)
                        .build(),

                Instructor.builder()
                        .name("Sneha Kulkarni")
                        .designation("Full Stack Web Developer & UI Educator")
                        .bio("Full stack developer and instructor specializing in React, TypeScript, modern CSS architectures, and performant web applications.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-sneha-kulkarni")
                        .yearsOfExperience(7)
                        .rating(4.8)
                        .totalStudents(9400)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Vikramaditya Rao")
                        .designation("Cloud & DevOps Solutions Architect")
                        .bio("Cloud solutions architect and educator specializing in AWS, Docker containerization, Kubernetes orchestration, and CI/CD automation.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-vikram-rao")
                        .yearsOfExperience(9)
                        .rating(4.6)
                        .totalStudents(6100)
                        .totalCourses(5)
                        .build(),

                Instructor.builder()
                        .name("Ananya Deshmukh")
                        .designation("Growth Marketer & Brand Strategist")
                        .bio("Growth marketing lead and digital strategy consultant. Expert in SEO, social media acquisition funnels, and performance marketing.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-ananya-deshmukh")
                        .yearsOfExperience(6)
                        .rating(4.6)
                        .totalStudents(8400)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Rohan Malhotra")
                        .designation("Product Executive & Venture Partner")
                        .bio("Former Senior Product Manager at top tech unicorns. Teaches product strategy, product analytics, and startup execution frameworks.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-rohan-malhotra")
                        .yearsOfExperience(11)
                        .rating(4.8)
                        .totalStudents(10500)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Kavita Reddy")
                        .designation("Corporate Finance Specialist & CFA")
                        .bio("Chartered Financial Analyst specializing in financial modeling, valuation, corporate accounting, and strategic investment analysis.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-kavita-reddy")
                        .yearsOfExperience(10)
                        .rating(4.7)
                        .totalStudents(7900)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Siddharth Joshi")
                        .designation("Cybersecurity Principal & Ethical Hacker")
                        .bio("Certified Ethical Hacker (CEH) and application security expert specializing in penetration testing, web security, and network defense.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-siddharth-joshi")
                        .yearsOfExperience(8)
                        .rating(4.8)
                        .totalStudents(6700)
                        .totalCourses(6)
                        .build(),

                Instructor.builder()
                        .name("Dr. Alok Tripathi")
                        .designation("Executive Leadership Coach & Behavioral Strategist")
                        .bio("Executive coach with PhD in Organizational Leadership. Specializes in negotiation, high-stakes communication, and executive decision-making.")
                        .profilePictureUrl("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80")
                        .linkedinUrl("https://linkedin.com/in/demo-alok-tripathi")
                        .yearsOfExperience(15)
                        .rating(4.9)
                        .totalStudents(14200)
                        .totalCourses(6)
                        .build()
        );

        for (Instructor inst : targetInstructors) {
            instructorRepo.findByName(inst.getName())
                    .map(existing -> {
                        existing.setDesignation(inst.getDesignation());
                        existing.setBio(inst.getBio());
                        existing.setYearsOfExperience(inst.getYearsOfExperience());
                        existing.setProfilePictureUrl(inst.getProfilePictureUrl());
                        return instructorRepo.save(existing);
                    })
                    .orElseGet(() -> instructorRepo.save(inst));
        }

        return instructorRepo.findAll();
    }

    private List<User> seedDemoUsers() {
        List<User> users = new ArrayList<>();
        String[] names = {
                "Arjun Sharma", "Sneha Patel", "Rohit Verma", 
                "Ananya Roy", "Deepak Kumar", "Meera Nair"
        };
        String[] emails = {
                "arjun.sharma@example.com", "sneha.patel@example.com", "rohit.verma@example.com",
                "ananya.roy@example.com", "deepak.kumar@example.com", "meera.nair@example.com"
        };

        for (int i = 0; i < names.length; i++) {
            if (!userRepo.existsByEmail(emails[i])) {
                User u = User.builder()
                        .fullName(names[i])
                        .email(emails[i])
                        .password(passwordEncoder.encode("User@123"))
                        .role(User.Role.USER)
                        .enabled(true)
                        .emailVerified(true)
                        .build();
                users.add(userRepo.save(u));
            } else {
                userRepo.findByEmail(emails[i]).ifPresent(users::add);
            }
        }
        return users;
    }

    private void seedAdminUser() {
        if (!userRepo.existsByEmail("admin@skillmint.com")) {
            User admin = User.builder()
                    .fullName("SkillMint Admin")
                    .email("admin@skillmint.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            userRepo.save(admin);
        }
        log.info("Admin account verified/created successfully.");
    }

    private Instructor findInstructorByName(List<Instructor> instructors, String name) {
        if (instructors != null) {
            for (Instructor i : instructors) {
                if (i != null && i.getName() != null && i.getName().equalsIgnoreCase(name)) {
                    return i;
                }
            }
        }
        return instructorRepo.findByName(name)
                .orElseGet(() -> (instructors != null && !instructors.isEmpty()) ? instructors.get(0) : null);
    }

    private Category getCat(String slug) {
        return categoryRepo.findBySlug(slug)
                .orElseGet(() -> categoryRepo.findAll().stream().findFirst().orElseThrow());
    }

    private List<Course> seedCourses(List<Instructor> instructors) {
        Instructor ashwani = findInstructorByName(instructors, "Ashwani Kumar");
        Instructor priya = findInstructorByName(instructors, "Priya Sharma");
        Instructor rajesh = findInstructorByName(instructors, "Rajesh Mehta");
        Instructor sneha = findInstructorByName(instructors, "Sneha Kulkarni");
        Instructor vikram = findInstructorByName(instructors, "Vikramaditya Rao");
        Instructor ananya = findInstructorByName(instructors, "Ananya Deshmukh");
        Instructor rohan = findInstructorByName(instructors, "Rohan Malhotra");
        Instructor kavita = findInstructorByName(instructors, "Kavita Reddy");
        Instructor siddharth = findInstructorByName(instructors, "Siddharth Joshi");
        Instructor alok = findInstructorByName(instructors, "Dr. Alok Tripathi");

        Category javaCat = getCat("java");
        Category springCat = getCat("spring-boot");
        Category webCat = getCat("web-development");
        Category reactCat = getCat("react");
        Category jsCat = getCat("javascript");
        Category nodeCat = getCat("nodejs");
        Category pythonCat = getCat("python");
        Category dsCat = getCat("data-science");
        Category mlCat = getCat("machine-learning");
        Category cloudCat = getCat("cloud-computing");
        Category devopsCat = getCat("devops");
        Category cyberCat = getCat("cybersecurity");
        Category dbCat = getCat("sql-db");
        Category sysCat = getCat("system-design");

        Category bizCat = getCat("business-management");
        Category leadershipCat = getCat("leadership");
        Category marketingCat = getCat("marketing");
        Category financeCat = getCat("finance");
        Category pmCat = getCat("project-management");
        Category entCat = getCat("entrepreneurship");
        Category prodCat = getCat("product-management");
        Category hrCat = getCat("human-resources");
        Category salesCat = getCat("sales-crm");
        Category commCat = getCat("communication-skills");
        Category opsCat = getCat("business-operations");

        List<Course> templates = new ArrayList<>();

        // ----------------------------------------------------
        // TECHNOLOGY COURSES (1 - 30)
        // ----------------------------------------------------
        templates.add(buildCourse("Java Programming Masterclass", "java-programming-masterclass",
                "Master core Java 17+, OOP, Collections, Lambda Expressions & Exception Handling.",
                "Complete Java development masterclass for beginners and professionals. Master object-oriented programming, modern Java 17/21 language features, memory management, multithreading, and stream API.",
                "Core Java Syntax & OOP Principles\nCollections Framework & Generics\nLambda Expressions & Stream API\nException Handling & File I/O\nMultithreading & Concurrency",
                "No prior programming experience required\nBasic computer operation literacy",
                javaCat, ashwani, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 12, "42h 30m", 4.8, 2450, 14200, true, true));

        templates.add(buildCourse("Advanced Java Development", "advanced-java-development",
                "Master Java Concurrency, JVM Internals, Memory Management & Garbage Collection.",
                "Deep dive into advanced Java concepts. Understand JVM architecture, garbage collection tuning, java.util.concurrent locks, CompletableFuture asynchronous patterns, and bytecode optimization.",
                "JVM Memory Model & GC Tuning\nAdvanced Multithreading & Locks\nCompletableFuture & Reactive Streams\nJava Reflection & Dynamic Proxies\nDesign Patterns in Java",
                "Solid understanding of core Java OOP concepts\nExperience writing basic Java applications",
                javaCat, ashwani, 5499.0, 2499.0, 55,
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 10, "36h 15m", 4.9, 1180, 6800, false, true));

        templates.add(buildCourse("Java Collections & Generics", "java-collections-generics",
                "Deep dive into List, Set, Map, Queue, Wildcards & Custom Data Structures.",
                "In-depth analysis of the Java Collections Framework. Learn internal data structure mechanics of ArrayList, HashMap, ConcurrentHashMap, PriorityQueue, and custom generic classes.",
                "Internal working of HashMap & HashSet\nCustom Generic classes & Wildcards (? extends T)\nConcurrent & Synchronized Collections\nPerformance Benchmarking & Big-O\nBest practices for collection choices",
                "Basic Java programming knowledge",
                javaCat, ashwani, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
                "English", "INTERMEDIATE", 8, "18h 45m", 4.7, 850, 5200, false, false));

        templates.add(buildCourse("Spring Boot & REST API Development", "spring-boot-rest-api-dev",
                "Build robust, production-ready RESTful web services with Spring Boot 3 & JPA.",
                "Learn enterprise backend engineering with Spring Boot 3. Master REST controller design, DTO mapping, Spring Data JPA, database migrations with Flyway, error handling, and Swagger API docs.",
                "Spring Boot 3 Core Annotations\nREST API Design & Exception Handling\nSpring Data JPA & Hibernate Repository\nDTO Pattern & MapStruct Mapping\nSwagger / OpenAPI 3 Documentation",
                "Basic Java programming knowledge\nUnderstanding of HTTP protocols",
                springCat, ashwani, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "INTERMEDIATE", 11, "52h 00m", 4.9, 3200, 16400, true, true));

        templates.add(buildCourse("Spring Security & JWT", "spring-security-jwt",
                "Secure enterprise REST APIs using OAuth2, Spring Security 6, JWT & RBAC.",
                "Comprehensive security guide for Java applications. Implement stateless JWT token authentication, refresh tokens, Role-Based Access Control (RBAC), Method Security, CORS, and CSRF protection.",
                "Spring Security 6 Architecture\nStateless JWT Authentication Flow\nRole-Based Access Control (RBAC)\nPassword Hashing with BCrypt\nSecurity Filters & Exception Handling",
                "Working knowledge of Spring Boot REST APIs",
                springCat, ashwani, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 9, "28h 30m", 4.8, 1650, 9100, false, true));

        templates.add(buildCourse("Hibernate & JPA Masterclass", "hibernate-jpa-masterclass",
                "Master Object-Relational Mapping, Entity Relationships, N+1 Problem & Caching.",
                "Master database persistence with JPA and Hibernate. Learn entity mapping, inheritance strategies, composite keys, criteria API, lazy vs eager fetching, N+1 query problem, and L2 cache.",
                "JPA Entity Mappings & Relationships\nSolving the N+1 Query Problem\nJPQL & Criteria API Queries\nHibernate Second-Level Caching\nTransaction Isolation & Locking",
                "Basic SQL knowledge\nBasic Java programming experience",
                javaCat, ashwani, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "26h 00m", 4.7, 940, 5800, false, false));

        templates.add(buildCourse("Microservices with Spring Boot", "microservices-spring-boot",
                "Build scalable microservices with Spring Cloud, Eureka, Gateway & Kafka.",
                "Architect resilient distributed microservices using Spring Cloud. Implement Eureka Service Registry, API Gateway, Resilience4j Circuit Breakers, Apache Kafka event streams, and Docker containerization.",
                "Microservices Architectural Principles\nService Discovery with Spring Cloud Eureka\nAPI Gateway Routing & Filters\nEvent-Driven Communication with Kafka\nResilience4j Circuit Breaker & Fallbacks",
                "Solid experience with Spring Boot & REST APIs",
                springCat, ashwani, 6999.0, 2999.0, 57,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 12, "68h 00m", 4.9, 2100, 11200, true, true));

        templates.add(buildCourse("React.js Complete Developer Course", "react-complete-developer-course",
                "Build modern, reactive web UIs with React 18, React Router 6 & Redux Toolkit.",
                "Master modern React 18 from scratch. Learn functional components, hooks (useState, useEffect, useReducer), custom hooks, React Router 6 routing, global state management, and API integration.",
                "React 18 Core Concepts & JSX\nState Management & Hooks\nReact Router v6 SPA Navigation\nRedux Toolkit & Global State\nIntegrating REST APIs with Axios",
                "Basic HTML, CSS, JavaScript fundamentals",
                reactCat, sneha, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 11, "48h 00m", 4.8, 3100, 17500, true, true));

        templates.add(buildCourse("React + TypeScript", "react-typescript-masterclass",
                "Build type-safe, enterprise React applications with TypeScript & React Query.",
                "Master type-safe frontend architecture with React 18 and TypeScript. Learn typing props, state, context, generics, custom hooks, and server state management using TanStack React Query.",
                "TypeScript Integration in React\nStrong Typing for Props & Events\nGeneric React Components\nTanStack React Query for Async Data\nCustom Hooks with Type Safety",
                "Familiarity with standard React.js",
                reactCat, sneha, 4999.0, 1999.0, 60,
                "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "34h 00m", 4.9, 1840, 9800, true, false));

        templates.add(buildCourse("Modern JavaScript Development", "modern-javascript-dev",
                "Master ES6+, Async/Await, Closures, Prototypes & Engine Mechanics.",
                "Deep dive into JavaScript core language semantics. Master ES6+ syntax, prototypes, closures, event loop, promises, async/await, DOM manipulation, and modular software design.",
                "JavaScript Event Loop & Async Execution\nClosures, Scope & Execution Context\nPrototypes & OOP in JavaScript\nPromises & Async / Await Syntax\nES6 Modules & Tooling",
                "Basic web development literacy",
                jsCat, sneha, 2999.0, 1299.0, 57,
                "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 10, "32h 15m", 4.7, 2100, 12800, false, true));

        templates.add(buildCourse("Node.js & Express", "nodejs-express-masterclass",
                "Build high-speed, scalable backend servers with Node.js, Express & MongoDB.",
                "Master server-side JavaScript development. Build non-blocking asynchronous REST APIs with Express.js, MongoDB database schemas with Mongoose, authentication middleware, and file upload systems.",
                "Node.js Event-Driven Architecture\nExpress.js Routing & Middleware\nMongoDB & Mongoose Data Modeling\nJWT Authentication & Password Security\nFile Uploads & Stream Handling",
                "Solid understanding of JavaScript ES6+",
                nodeCat, sneha, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 10, "40h 00m", 4.8, 1920, 11400, false, true));

        templates.add(buildCourse("Python Programming Masterclass", "python-programming-masterclass",
                "Master Python 3 from scratch: Data Structures, OOP, Scripting & Modules.",
                "Comprehensive Python programming course for beginners and developers. Learn clean Python syntax, list comprehensions, object-oriented design, file handling, modules, and popular libraries.",
                "Python 3 Syntax & Control Structures\nBuilt-in Data Structures (List, Dict, Set, Tuple)\nObject-Oriented Programming in Python\nModules, Packages & Virtual Environments\nFile Handling & Exception Management",
                "No prior programming experience required",
                pythonCat, priya, 2999.0, 999.0, 67,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 12, "45h 00m", 4.9, 4100, 22000, true, true));

        templates.add(buildCourse("Python for Data Analysis", "python-data-analysis",
                "Analyze data using Pandas, NumPy, Matplotlib & Seaborn.",
                "Master data analysis workflows in Python. Clean raw data, perform exploratory data analysis (EDA), manipulate DataFrames with Pandas, vectorize numerical arrays with NumPy, and create statistical charts.",
                "NumPy Vectorized Computing\nPandas DataFrames Manipulation & Cleaning\nHandling Missing Data & Time Series\nData Visualization with Matplotlib & Seaborn\nExploratory Data Analysis (EDA) Projects",
                "Basic Python programming knowledge",
                dsCat, priya, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "38h 30m", 4.8, 2600, 14500, true, true));

        templates.add(buildCourse("Machine Learning Fundamentals", "machine-learning-fundamentals",
                "Master Supervised & Unsupervised ML algorithms with Scikit-Learn.",
                "Practical introduction to Machine Learning algorithms. Learn linear regression, logistic regression, decision trees, random forests, k-means clustering, cross-validation, and hyperparameter tuning.",
                "Supervised vs Unsupervised Learning\nRegression & Classification Algorithms\nModel Evaluation Metrics (Precision, Recall, ROC)\nDecision Trees & Ensemble Random Forests\nHyperparameter Tuning with GridSearch",
                "Python programming and basic linear algebra",
                mlCat, priya, 5499.0, 2499.0, 55,
                "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 10, "50h 00m", 4.9, 2980, 15800, true, true));

        templates.add(buildCourse("Generative AI & LLM Applications", "generative-ai-llm-apps",
                "Build AI applications with LangChain, OpenAI APIs, Vector DBs & RAG.",
                "Learn how to build cutting-edge Generative AI software. Master prompt engineering, LangChain framework, OpenAI GPT-4 APIs, vector databases (Chroma / Pinecone), and Retrieval-Augmented Generation (RAG).",
                "Prompt Engineering & LLM Architecture\nLangChain Framework & Chains\nVector Embeddings & Vector Databases\nBuilding RAG Applications with Private Data\nDeploying AI Chatbots & Agents",
                "Python programming experience",
                mlCat, priya, 6999.0, 2999.0, 57,
                "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 9, "35h 00m", 4.9, 1890, 10200, true, true));

        templates.add(buildCourse("SQL & MySQL Masterclass", "sql-mysql-masterclass",
                "Master SQL Database Queries, JOINs, Grouping & Database Design.",
                "Comprehensive database querying masterclass. Write complex SQL queries, JOIN multiple tables, perform aggregations, design normalized database schemas, and create database indexes.",
                "Relational Database Principles & ER Diagrams\nSELECT, WHERE, ORDER BY & Filtering\nINNER, LEFT, RIGHT & FULL OUTER JOINs\nGROUP BY, HAVING & Aggregate Functions\nDatabase Indexing & Performance Basics",
                "No prior technical experience required",
                dbCat, priya, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 10, "30h 00m", 4.8, 3400, 18900, false, true));

        templates.add(buildCourse("Advanced SQL", "advanced-sql-performance",
                "Master Window Functions, CTEs, Indexing & Query Tuning.",
                "Advanced SQL querying and performance optimization. Master RANK, DENSE_RANK, Window Functions, Common Table Expressions (CTEs), stored procedures, execution plan analysis, and indexing strategies.",
                "SQL Window Functions (OVER, PARTITION BY, RANK)\nRecursive Common Table Expressions (CTEs)\nStored Procedures & User Defined Functions\nAnalyzing EXPLAIN Query Plans\nAdvanced B-Tree Indexing Strategies",
                "Solid understanding of basic SQL SELECT queries",
                dbCat, priya, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 8, "24h 00m", 4.8, 1420, 8100, false, false));

        templates.add(buildCourse("Data Structures & Algorithms", "dsa-java-python",
                "Master Arrays, Trees, Graphs, Dynamic Programming & Coding Interviews.",
                "Comprehensive computer science DSA masterclass. Learn array algorithms, linked lists, stacks, queues, binary trees, graph traversals (BFS/DFS), sorting algorithms, dynamic programming, and Big-O notation.",
                "Big-O Time & Space Complexity Analysis\nArrays, Linked Lists, Stacks & Queues\nBinary Search Trees & Heap Priority Queues\nGraph Algorithms (BFS, DFS, Dijkstra)\nDynamic Programming & Greedy Patterns",
                "Knowledge of at least one programming language (Java, C++, or Python)",
                javaCat, ashwani, 4999.0, 1999.0, 60,
                "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80",
                "Hindi + English", "INTERMEDIATE", 12, "60h 00m", 4.9, 4500, 24000, true, true));

        templates.add(buildCourse("AWS Cloud Practitioner", "aws-cloud-practitioner-prep",
                "Pass the AWS Cloud Practitioner Certification (CLF-C02) on first attempt.",
                "Complete AWS cloud certification preparation course. Learn core AWS services (EC2, S3, RDS, IAM, Lambda, VPC), cloud security, billing, global infrastructure, and well-architected framework.",
                "AWS Global Infrastructure & IAM Security\nCompute Services (EC2, Lambda, ECS)\nStorage & Databases (S3, EBS, RDS, DynamoDB)\nNetworking (VPC, Subnets, Security Groups)\nAWS Billing, Pricing & Support Plans",
                "Basic understanding of computers and internet",
                cloudCat, vikram, 3499.0, 1299.0, 63,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 9, "28h 00m", 4.7, 2300, 13400, true, false));

        templates.add(buildCourse("AWS Solutions Architecture", "aws-solutions-architecture-associate",
                "Design highly available, fault-tolerant enterprise cloud architectures on AWS.",
                "Prepare for the AWS Certified Solutions Architect Associate exam. Learn auto-scaling, load balancing (ALB), multi-region architectures, CloudFront CDN, SQS/SNS messaging, and cost management.",
                "High Availability Architecture & Auto Scaling\nApplication Load Balancer & Route 53 DNS\nDecoupled Architectures with SQS & SNS\nDisaster Recovery & Backup Strategies\nCost Optimization & CloudWatch Monitoring",
                "AWS Cloud Practitioner level knowledge",
                cloudCat, vikram, 5999.0, 2499.0, 58,
                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 11, "48h 00m", 4.9, 1750, 9600, true, true));

        templates.add(buildCourse("Docker & Kubernetes", "docker-kubernetes-devops-mastery",
                "Master Containerization, Docker Compose, Kubernetes Pods & Deployments.",
                "Complete container engineering and orchestration masterclass. Build production Docker images, manage multi-container apps with Docker Compose, and orchestrate workloads on Kubernetes clusters.",
                "Docker Containers, Images & Dockerfiles\nMulti-Container Environments with Docker Compose\nKubernetes Cluster Architecture & Pods\nDeployments, StatefulSets & Services\nIngress Controllers & Helm Package Manager",
                "Basic Linux command line knowledge",
                devopsCat, vikram, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 10, "42h 00m", 4.8, 1680, 8900, true, true));

        templates.add(buildCourse("DevOps with Jenkins & CI/CD", "devops-jenkins-cicd-pipelines",
                "Automate Build, Test & Deployment pipelines using Jenkins & GitHub Actions.",
                "Master Continuous Integration and Continuous Deployment (CI/CD). Build automated pipelines using Jenkinsfile, integrate SonarQube quality gates, Docker registry publishing, and automated cloud deployments.",
                "CI/CD Core Concepts & Automation\nJenkins Declarative Pipelines & Groovy\nQuality Gates with SonarQube & Unit Tests\nAutomated Docker Builds & Registry Push\nGitHub Actions & Deployment Automation",
                "Understanding of Git version control and Docker basics",
                devopsCat, vikram, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "30h 00m", 4.7, 1250, 7200, false, false));

        templates.add(buildCourse("Git & GitHub Masterclass", "git-github-masterclass",
                "Master Version Control, Branching Strategies, Rebase & GitHub Workflows.",
                "Essential version control masterclass for developers. Learn Git commits, branching strategies (GitFlow, Trunk-based), rebasing vs merging, cherry-picking, pull requests, and GitHub Actions.",
                "Git Internal Architecture & Object Database\nBranching, Merging & Conflict Resolution\nInteractive Rebasing & Cherry-Picking\nGitHub Pull Requests & Code Review Workflows\nGit Stash, Tagging & Release Management",
                "No prerequisites required",
                webCat, sneha, 1999.0, 799.0, 60,
                "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 7, "16h 00m", 4.8, 2900, 16200, false, false));

        templates.add(buildCourse("Cybersecurity Fundamentals", "cybersecurity-fundamentals-defense",
                "Learn Network Defense, OWASP Security, Encryption & Threat Mitigation.",
                "Foundational cybersecurity training. Understand OSI model security, firewalls, public key cryptography (RSA/AES), OWASP Top 10 web application vulnerabilities, and incident response.",
                "Cybersecurity Principles & CIA Triad\nNetwork Security Protocols & Wireshark\nOWASP Top 10 Web Vulnerabilities\nSymmetric & Asymmetric Encryption\nIdentity & Access Management (IAM)",
                "Basic understanding of computers and networking",
                cyberCat, siddharth, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 8, "26h 00m", 4.6, 1100, 6400, false, true));

        templates.add(buildCourse("Mobile App Development with React Native", "mobile-app-react-native",
                "Build cross-platform iOS & Android mobile apps with React Native & Expo.",
                "Master mobile app development for iOS and Android. Build native mobile interfaces with React Native, Expo, navigation libraries, async storage, camera access, and push notifications.",
                "React Native Components & Styling\nExpo SDK & Native API Integrations\nReact Navigation (Stack, Tabs, Drawer)\nAsyncStorage & Local Data Persistence\nPublishing Apps to App Store & Google Play",
                "Knowledge of React.js & JavaScript ES6+",
                reactCat, sneha, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 10, "40h 00m", 4.8, 1450, 8300, false, false));

        templates.add(buildCourse("GraphQL API Architecture with Node & Java", "graphql-api-architecture",
                "Design flexible, performant GraphQL schemas with Apollo & Spring GraphQL.",
                "Master modern GraphQL API development. Learn schema definition language (SDL), queries, mutations, subscriptions, N+1 query solving with DataLoaders, and Apollo Server integration.",
                "GraphQL vs REST Architecture\nSchema Definitions, Types & Enums\nResolvers, Mutations & Subscriptions\nSolving N+1 Query Problem with DataLoaders\nAuthentication & Schema Security",
                "Basic understanding of Node.js or Java REST APIs",
                webCat, ashwani, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "24h 00m", 4.7, 780, 4900, false, false));

        templates.add(buildCourse("System Design & Distributed Systems", "system-design-distributed-systems",
                "Architect high-scale distributed systems: Load Balancers, Caching & DB Sharding.",
                "Master system design for tech interviews and real-world scalability. Learn load balancing, Redis caching, database partitioning/sharding, CAP theorem, message queues, and rate limiters.",
                "System Design Interview Framework\nLoad Balancers & Reverse Proxies\nRedis Caching Strategies & Eviction\nDatabase Sharding & Replication\nMessage Queues (Kafka / RabbitMQ)",
                "Solid experience with backend development",
                sysCat, ashwani, 6499.0, 2799.0, 57,
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 10, "45h 00m", 4.9, 2100, 11800, true, true));

        templates.add(buildCourse("Go (Golang) Microservices Engineering", "golang-microservices-engineering",
                "Build high-performance microservices with Go, gRPC, Protobuf & Gin.",
                "Master Go programming language for cloud-native microservices. Learn Goroutines, channels, gRPC protocol buffers, Gin web framework, and high-concurrency backend development.",
                "Go Language Syntax, Structs & Interfaces\nGoroutines & Channels Concurrency Model\ngRPC & Protocol Buffers Communication\nBuilding REST APIs with Gin Framework\nBuilding High-Throughput Cloud Microservices",
                "Prior programming experience in any language",
                sysCat, vikram, 4999.0, 2199.0, 56,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "32h 00m", 4.8, 920, 5600, false, false));

        templates.add(buildCourse("Web Security & Penetration Testing", "web-security-penetration-testing",
                "Ethical Hacking: Master SQL Injection, XSS, CSRF & Burp Suite.",
                "Practical web security testing masterclass. Learn ethical hacking methodologies, Burp Suite intercepting proxy, SQL injection exploitation, Cross-Site Scripting (XSS), and security patching.",
                "Web Security Fundamentals & Burp Suite\nSQL Injection Attacks & Mitigation\nCross-Site Scripting (XSS) Exploitation\nCross-Site Request Forgery (CSRF)\nAuthentication & Session Hijacking Fixes",
                "Basic understanding of web technologies (HTML, JS, HTTP)",
                cyberCat, siddharth, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "35h 00m", 4.8, 1340, 7800, false, true));

        templates.add(buildCourse("Data Engineering Pipelines with Apache Spark", "data-engineering-apache-spark",
                "Build Big Data ETL pipelines with PySpark, Delta Lake & Airflow.",
                "Master big data engineering architectures. Build distributed ETL pipelines with PySpark, manage data lakes using Delta Lake, orchestrate workflows with Apache Airflow, and process batch data.",
                "Big Data Fundamentals & Spark Architecture\nPySpark DataFrames & RDD Operations\nDelta Lake ACID Transactions & Time Travel\nWorkflow Orchestration with Apache Airflow\nData Warehouse & Data Lake Design",
                "Python programming and SQL query proficiency",
                dsCat, priya, 5999.0, 2699.0, 55,
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 10, "44h 00m", 4.8, 890, 5100, false, false));


        // ----------------------------------------------------
        // MANAGEMENT / BUSINESS COURSES (31 - 60)
        // ----------------------------------------------------
        templates.add(buildCourse("Agile Project Management & Scrum", "agile-project-management-scrum-master",
                "Master Scrum Ceremonies, Sprint Planning, User Stories & Agile Leadership.",
                "Comprehensive Scrum Master and Agile PM guide. Learn sprint planning, backlog grooming, daily standups, retrospectives, user story estimation, velocity tracking, and Jira project management.",
                "Agile Principles & Scrum Framework\nProduct Backlog Refinement & Estimation\nSprint Planning, Standup & Retrospective\nTracking Team Velocity & Burn-down Charts\nManaging Projects in Atlassian Jira",
                "No prerequisites required",
                pmCat, rajesh, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 8, "28h 00m", 4.8, 2900, 15400, true, true));

        templates.add(buildCourse("Professional Project Management Fundamentals", "pmp-project-management-fundamentals",
                "Master PMP PMBOK concepts, Risk Management & Project Scheduling.",
                "Foundational project management course aligned with international PMBOK standards. Learn project charter creation, work breakdown structures (WBS), Gantt charts, risk matrices, and stakeholder management.",
                "Project Management Lifecycle & PMBOK\nWork Breakdown Structure (WBS) Creation\nCritical Path Method & Gantt Scheduling\nProject Risk Management & Mitigation\nStakeholder Communication & Control",
                "Basic workplace experience helpful",
                pmCat, rajesh, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 10, "38h 00m", 4.7, 1650, 9200, false, false));

        templates.add(buildCourse("Digital Marketing Strategy", "digital-marketing-strategy-mastery",
                "Master SEO, PPC Advertising, Content Growth & GA4 Data Analytics.",
                "Complete digital marketing blueprint for brands and marketers. Master search engine optimization, Google Ads PPC campaigns, social media growth, email marketing automation, and Google Analytics 4.",
                "Digital Marketing Funnel & Customer Journey\nSearch Engine Optimization (SEO) Strategy\nGoogle Search Ads & Meta Paid Advertising\nContent Marketing & Email Automation\nGoogle Analytics 4 (GA4) Tracking",
                "No technical background required",
                marketingCat, ananya, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 9, "35h 00m", 4.8, 3100, 16800, true, true));

        templates.add(buildCourse("SEO & Content Marketing", "seo-content-marketing-growth",
                "Rank #1 on Google with On-Page SEO, Off-Page Link Building & Keyword Strategy.",
                "Master organic growth through search engines. Learn keyword research, technical SEO audits, site speed optimization, high-converting content creation, and white-hat backlink building techniques.",
                "Keyword Research & Search Intent Mapping\nOn-Page SEO Optimization & Schema Markup\nTechnical SEO Audits & Core Web Vitals\nHigh-Impact Content Creation Frameworks\nLink Building & Off-Page Authority Growth",
                "Basic understanding of website browsing",
                marketingCat, ananya, 2999.0, 1299.0, 57,
                "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 8, "24h 00m", 4.7, 1850, 10400, false, true));

        templates.add(buildCourse("Social Media Marketing", "social-media-marketing-paid-organic",
                "Grow Brand Reach on Instagram, LinkedIn, YouTube & Meta Ad Campaigns.",
                "Learn social media marketing for brands and creators. Master content calendar creation, short-form video strategies (Reels/Shorts), targeted Meta advertising, LinkedIn B2B lead generation, and viral reach.",
                "Platform Algorithms (Instagram, LinkedIn, YouTube)\nContent Strategy & Visual Storytelling\nMeta Ads Manager & Audience Targeting\nInfluencer Marketing & Partnership Strategy\nCommunity Management & Brand Growth",
                "Basic familiarity with social media platforms",
                marketingCat, ananya, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 7, "20h 00m", 4.6, 2400, 13800, false, false));

        templates.add(buildCourse("Business Analytics", "business-analytics-data-driven-decisions",
                "Transform Business Data into Strategy using Excel, SQL & Data Storytelling.",
                "Master data-driven business analytics. Learn how to formulate business questions, extract SQL metrics, analyze historical trends in Excel, evaluate KPIs, and present recommendations to leadership.",
                "Business Problem Formulation & KPIs\nExcel PivotTables, Data Modeling & VLOOKUP\nSQL Querying for Business Metrics\nCohort Analysis & Customer Churn Modeling\nExecutive Presentation & Data Storytelling",
                "Basic math literacy",
                dsCat, kavita, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 9, "32h 00m", 4.8, 2150, 12200, true, true));

        templates.add(buildCourse("Microsoft Excel for Business", "excel-for-business-advanced",
                "Master Advanced Formulas, Pivot Tables, Power Query & Business Automation.",
                "Essential Microsoft Excel masterclass for corporate professionals. Master INDEX/MATCH, XLOOKUP, Nested IFs, Dynamic Arrays, PivotTables, Slicers, Power Query data transformation, and chart design.",
                "Modern Formulas (XLOOKUP, FILTER, UNIQUE)\nPivotTables, Calculated Fields & Slicers\nPower Query Data Transformation\nFinancial & Business Functions (NPV, IRR)\nDashboard Design & Visual Analytics",
                "No prior Excel experience required",
                bizCat, kavita, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 10, "28h 00m", 4.9, 4800, 26000, true, true));

        templates.add(buildCourse("Power BI & Data Visualization", "power-bi-data-visualization-mastery",
                "Build Interactive Business Dashboards with DAX Formulas & Power BI Desktop.",
                "Master business intelligence dashboarding with Microsoft Power BI. Import data from diverse sources, build DAX measures, create responsive drill-through visual dashboards, and publish report portals.",
                "Connecting Data Sources in Power BI\nData Transformation with Power Query\nDAX Calculations (CALCULATE, SUMX, Time Intelligence)\nInteractive Dashboard & Visual Design\nPublishing & Workspace Sharing",
                "Basic understanding of Excel or databases",
                dsCat, kavita, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "30h 00m", 4.8, 1950, 11000, true, false));

        templates.add(buildCourse("Corporate Financial Analysis", "corporate-financial-analysis-mastery",
                "Analyze Income Statements, Balance Sheets, Cash Flow & Financial Ratios.",
                "Master corporate financial statement analysis. Evaluate liquidity, profitability, leverage, and activity ratios, interpret cash flow statements, and assess corporate financial health.",
                "Income Statement & Revenue Recognition\nBalance Sheet Structure & Working Capital\nStatement of Cash Flows Analysis\nFinancial Ratio Benchmarking & Dupont Analysis\nAssessing Corporate Financial Distress",
                "Basic accounting or business interest",
                financeCat, kavita, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "36h 00m", 4.7, 1320, 7600, false, true));

        templates.add(buildCourse("Financial Modeling & Valuation", "financial-modeling-valuation-dcf",
                "Build 3-Statement Financial Models & Discounted Cash Flow (DCF) Valuations.",
                "Practical financial modeling bootcamp for investment banking and corporate finance. Build dynamic 3-statement forecast models in Excel, perform DCF valuations, and run sensitivity analyses.",
                "3-Statement Financial Modeling in Excel\nRevenue & Expense Forecasting Drivers\nDiscounted Cash Flow (DCF) Valuation Model\nWACC Calculation & Terminal Value\nSensitivity Tables & Scenario Analysis",
                "Knowledge of basic Excel and financial statements",
                financeCat, kavita, 6499.0, 2799.0, 57,
                "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 11, "46h 00m", 4.9, 1620, 8900, true, true));

        templates.add(buildCourse("Entrepreneurship & Startup Strategy", "entrepreneurship-startup-strategy",
                "From Idea Validation to Business Model Canvas, Pitch Decks & Fundraising.",
                "Comprehensive startup playbook for founders. Learn business model canvas validation, minimum viable product (MVP) design, customer discovery, unit economics, pitch deck creation, and seed fundraising.",
                "Business Model Canvas & Value Proposition\nCustomer Discovery & MVP Testing\nUnit Economics, CAC & Lifetime Value (LTV)\nCrafting Winning Investor Pitch Decks\nNavigating Seed & Series A Fundraising",
                "No prerequisites required",
                entCat, rohan, 4999.0, 1999.0, 60,
                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 9, "32h 00m", 4.8, 1780, 9900, true, false));

        templates.add(buildCourse("Product Management Fundamentals", "product-management-fundamentals",
                "Master PRDs, User Discovery, Feature Prioritization & Launch Roadmaps.",
                "End-to-end product management training. Learn how to write Product Requirement Documents (PRDs), run user interviews, prioritize feature backlogs with RICE framework, design wireframes, and launch digital products.",
                "Product Manager Role & Cross-Functional Leadership\nUser Research & Problem Validation\nWriting Effective PRDs & Specifications\nPrioritization Frameworks (RICE, Kano, Impact)\nProduct Analytics & Metric Tracking",
                "Interest in technology products and strategy",
                prodCat, rohan, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 10, "40h 00m", 4.8, 2650, 14200, true, true));

        templates.add(buildCourse("Leadership & Management", "leadership-management-executive-presence",
                "Develop Executive Presence, Team Coaching, Strategic Alignment & Conflict Resolution.",
                "Transformational leadership development course for managers and leads. Learn situational leadership styles, emotional intelligence in management, delegating effectively, and building high-trust organizational culture.",
                "Situational Leadership & Management Styles\nEmotional Intelligence & Active Listening\nConstructive Feedback & Conflict Resolution\nBuilding High-Performance Team Culture\nExecutive Communication & Decision Making",
                "Ideal for current or aspiring managers",
                leadershipCat, alok, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 8, "28h 00m", 4.9, 2100, 12500, true, true));

        templates.add(buildCourse("Human Resource Management", "human-resource-management-hr-strategy",
                "Master Strategic HR Planning, Employee Engagement & Performance Management.",
                "Complete HR management overview. Learn strategic workforce planning, employee onboarding, performance review frameworks (OKRs/KPIs), labor relations, and organizational development.",
                "Strategic HR Planning & Organizational Design\nTalent Onboarding & Employee Lifecycle\nPerformance Appraisal & OKR Implementation\nEmployee Engagement & Retention Strategies\nLabor Law Compliance & Workplace Relations",
                "Basic understanding of corporate workplace",
                hrCat, rajesh, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 8, "26h 00m", 4.6, 1240, 7100, false, false));

        templates.add(buildCourse("Talent Acquisition & Recruitment", "talent-acquisition-recruitment-strategy",
                "Master Sourcing, Behavioral Interviewing & Employer Branding.",
                "Modern recruiter training for talent acquisition professionals. Learn candidate sourcing on LinkedIn Recruiter, structured behavioral interview techniques, salary negotiation, and employer branding.",
                "Strategic Sourcing & Boolean Search Queries\nStructured Behavioral Interviewing\nCandidate Pipeline & ATS Management\nOffer Negotiation & Candidate Closing\nEmployer Branding & Recruitment Marketing",
                "No prerequisites required",
                hrCat, rajesh, 2999.0, 1299.0, 57,
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 7, "22h 00m", 4.7, 980, 5900, false, false));

        templates.add(buildCourse("Business Communication", "business-communication-executive-writing",
                "Master Professional Business Writing, Email Etiquette & Executive Speaking.",
                "Essential communication mastery for corporate professionals. Learn crisp executive writing, structuring persuasive proposals, active listening, public speaking, and impactful meeting facilitation.",
                "Principles of Clear Business Writing\nStructuring Persuasive Proposals & Memos\nExecutive Email Etiquette & Professional Tone\nPublic Speaking & Overcoming Anxiety\nEffective Meeting Facilitation Frameworks",
                "No prerequisites required",
                commCat, alok, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 7, "18h 00m", 4.8, 3100, 17200, false, true));

        templates.add(buildCourse("Strategic Management", "strategic-management-corporate-competitive",
                "Master Competitive Strategy, SWOT Analysis, Porter's Five Forces & Execution.",
                "Executive strategic management masterclass. Evaluate industry competitive forces, design differentiation strategies, execute corporate diversification, and realign organizational capabilities.",
                "Industry Structural Analysis (Porter's Five Forces)\nCore Competency & Resource-Based View\nCorporate Diversification & M&A Strategy\nStrategic Execution & Change Management\nBalanced Scorecard Implementation",
                "Basic understanding of business operations",
                bizCat, rajesh, 4999.0, 1999.0, 60,
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 9, "34h 00m", 4.8, 1420, 8100, false, false));

        templates.add(buildCourse("Operations Management", "operations-management-process-optimization",
                "Master Process Mapping, Lean Six Sigma Principles & Operational Efficiency.",
                "Optimize corporate business operations. Learn process flow mapping, bottleneck elimination, Lean Six Sigma methodologies, quality control charts, and operational cost reduction.",
                "Operations Strategy & Process Analysis\nLean Principles & Waste Elimination (Muda)\nSix Sigma Quality Management & DMAIC\nInventory Control & Capacity Planning\nSupply Chain Process Optimization",
                "No prior operations experience required",
                opsCat, rajesh, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "28h 00m", 4.6, 950, 5400, false, false));

        templates.add(buildCourse("Sales Management", "sales-management-pipeline-closing",
                "Master B2B Sales Pipeline, Deal Closing, Sales Coaching & Quota Management.",
                "Comprehensive B2B sales management course. Learn consultative selling techniques, sales pipeline forecasting, handling objections, closing high-ticket enterprise deals, and managing sales teams.",
                "Consultative B2B Sales Framework\nPipeline Stages & Accurate Sales Forecasting\nObjection Handling & Value Proposition\nEnterprise Deal Closing Strategies\nSales Team Motivation & Incentive Design",
                "Passion for business development and sales",
                salesCat, rohan, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "INTERMEDIATE", 8, "26h 00m", 4.7, 1380, 7900, false, true));

        templates.add(buildCourse("Customer Relationship Management", "customer-relationship-management-crm",
                "Master CRM Strategy, Salesforce Workflows, Retention & Customer Success.",
                "Learn modern CRM and customer success management. Implement customer lifecycle strategies, reduce churn, configure CRM workflows (Salesforce / HubSpot), and track Net Promoter Score (NPS).",
                "Customer Lifecycle & Retention Strategy\nHubSpot & Salesforce CRM Workflow Setup\nCustomer Success Onboarding Protocols\nCustomer Health Scores & Churn Prevention\nMeasuring Net Promoter Score (NPS) & CSAT",
                "Basic understanding of business operations",
                salesCat, rohan, 2999.0, 1299.0, 57,
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 7, "20h 00m", 4.6, 1150, 6800, false, false));

        templates.add(buildCourse("Investment & Personal Finance", "investment-personal-finance-wealth",
                "Master Mutual Funds, Stock Market Basics, Asset Allocation & Wealth Creation.",
                "Practical personal financial management and investment masterclass. Learn budgeting, mutual fund selection, equity stock market fundamentals, tax planning, asset allocation, and long-term compounding.",
                "Principles of Personal Financial Planning\nMutual Funds, Index Funds & SIP Investing\nStock Market Fundamental Analysis Basics\nTax Savings Frameworks & Asset Allocation\nBuilding Passive Income & Retirement Portfolios",
                "No financial background required",
                financeCat, kavita, 2499.0, 999.0, 60,
                "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 9, "25h 00m", 4.9, 5200, 29000, true, true));

        templates.add(buildCourse("Business Presentation Skills", "business-presentation-skills-storytelling",
                "Craft High-Impact Slide Decks & Deliver Powerful Boardroom Presentations.",
                "Master corporate presentation skills. Learn visual slide design principles, executive storytelling frameworks, slide hierarchy, data chart simplification, and confident boardroom Q&A handling.",
                "Executive Presentation Structure & Narrative\nVisual Slide Hierarchy & Design Rules\nSimplifying Complex Data Charts\nBody Language & Vocal Delivery Mastery\nHandling Tough Boardroom Questions & Q&A",
                "No prior public speaking experience needed",
                commCat, alok, 2999.0, 1299.0, 57,
                "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60",
                "English", "BEGINNER", 7, "18h 30m", 4.8, 1920, 11200, false, true));

        templates.add(buildCourse("Negotiation & Decision Making", "negotiation-decision-making-strategy",
                "Master High-Stakes Negotiation, BATNA Strategy & Psychological Influence.",
                "Advanced strategic negotiation training. Learn principled negotiation, determining BATNA (Best Alternative to a Negotiated Agreement), tactical empathy, handling hardball tactics, and closing win-win deals.",
                "Principled Negotiation & Value Creation\nBATNA & ZOPA Strategic Calculation\nTactical Empathy & Active Listening\nCountering Hardball Negotiation Tactics\nClosing High-Stakes Commercial Contracts",
                "Open to all professionals and managers",
                commCat, alok, 4499.0, 1999.0, 56,
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "24h 00m", 4.9, 1680, 9500, true, false));

        templates.add(buildCourse("E-Commerce Business Strategy", "e-commerce-business-strategy-growth",
                "Build & Scale E-Commerce Stores with Shopify, Performance Ads & Logistics.",
                "Comprehensive e-commerce playbook. Learn product sourcing, Shopify store setup, conversion rate optimization (CRO), Meta/Google shopping ads, inventory management, and customer retention.",
                "E-Commerce Niche Selection & Product Sourcing\nShopify Store Design & Checkout Optimization\nMeta & Google Shopping Ad Campaigns\nFulfillment Logistics & Inventory Control\nRepeat Purchase & Email Marketing Funnels",
                "No technical background required",
                entCat, ananya, 3999.0, 1699.0, 57,
                "https://images.unsplash.com/photo-1556742049-0a67daf64f42?w=800&auto=format&fit=crop&q=60",
                "Hindi + English", "BEGINNER", 9, "30h 00m", 4.7, 2150, 12600, false, true));

        templates.add(buildCourse("Brand Strategy & Brand Management", "brand-strategy-brand-management",
                "Build Iconic Brands with Clear Positioning, Brand Equity & Storytelling.",
                "Strategic brand architecture masterclass. Learn brand identity design, positioning statements, measuring brand equity, emotional branding, crisis communications, and consistent multi-channel messaging.",
                "Brand Architecture & Positioning Frameworks\nMeasuring Brand Equity & Perception\nEmotional Storytelling & Identity Design\nManaging Brand Consistency Across Channels\nBrand Crisis Management & Reputation Control",
                "Basic understanding of marketing concepts",
                marketingCat, ananya, 3499.0, 1499.0, 57,
                "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "25h 00m", 4.7, 1120, 6700, false, false));

        templates.add(buildCourse("Product Analytics & Growth Hacking", "product-analytics-growth-hacking",
                "Drive User Retention & Viral Growth with Mixpanel, Amplitude & A/B Testing.",
                "Advanced product growth masterclass. Learn product metrics (AARRR funnel), event tracking setup in Mixpanel/Amplitude, designing A/B experiments, calculating retention cohorts, and optimizing conversion funnels.",
                "AARRR Growth Funnel Framework\nSetting Up Product Event Analytics\nCohort Retention & Churn Analysis\nDesigning & Executing A/B Experiments\nViral Loops & Product-Led Growth (PLG)",
                "Familiarity with digital product management or marketing",
                prodCat, rohan, 4999.0, 2199.0, 56,
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 8, "28h 00m", 4.8, 1290, 7400, false, false));

        templates.add(buildCourse("Supply Chain & Logistics Operations", "supply-chain-logistics-operations",
                "Master Supply Chain Strategy, Procurement, Inventory & Warehousing.",
                "Essential supply chain management course. Learn procurement strategies, inventory optimization models (EOQ), warehouse layout design, freight logistics, and supply chain risk mitigation.",
                "End-to-End Supply Chain Architecture\nProcurement & Vendor Relationship Management\nInventory Optimization & EOQ Modeling\nWarehouse Management Systems & Layout\nSupply Chain Risk & Resilience Planning",
                "Basic business understanding",
                opsCat, rajesh, 4499.0, 1899.0, 58,
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "27h 00m", 4.6, 890, 5100, false, false));

        templates.add(buildCourse("Executive Coaching & Team Leadership", "executive-coaching-team-leadership",
                "Master GROW Coaching Model, Executive Mentoring & Culture Alignment.",
                "Advanced coaching framework for senior executives. Learn the GROW coaching model, active listening, asking powerful open-ended questions, mentoring future leaders, and aligning company culture.",
                "GROW Coaching Model & Application\nAsking High-Impact Open-Ended Questions\nMentoring vs Managerial Coaching\nBuilding Trust & Psychological Safety\nAligning Team Culture with Corporate Mission",
                "Experience managing people or leading projects",
                leadershipCat, alok, 5499.0, 2499.0, 55,
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
                "English", "ADVANCED", 8, "26h 00m", 4.9, 1050, 6200, false, false));

        templates.add(buildCourse("Artificial Intelligence for Business Leaders", "ai-for-business-leaders-strategy",
                "Strategic AI Adoption, Generative AI Use Cases & Business Transformation.",
                "Non-technical AI executive course. Learn how AI transforms business models, evaluate AI vendor solutions, manage AI implementation risks, assess ROI, and lead corporate AI transformation.",
                "AI Capabilities & Business Landscape\nIdentifying High-ROI Generative AI Use Cases\nManaging AI Ethics, Data Security & Governance\nEvaluating AI Vendors vs Custom Build\nLeading AI Culture Transformation",
                "No technical programming required",
                bizCat, rohan, 5999.0, 2699.0, 55,
                "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 7, "22h 00m", 4.9, 1420, 8300, true, true));

        templates.add(buildCourse("Risk Management & Corporate Governance", "risk-management-corporate-governance",
                "Identify Corporate Risks, Internal Controls, Compliance & Governance.",
                "Essential enterprise risk governance course. Learn enterprise risk management (ERM) frameworks, internal audit compliance, board governance standards, risk matrices, and crisis mitigation.",
                "Enterprise Risk Management (ERM) Frameworks\nDesigning Internal Financial & Operational Controls\nBoard Governance & Fiduciary Duties\nRegulatory Compliance & Audit Preparedness\nCrisis Mitigation & Business Continuity",
                "Understanding of corporate structure",
                bizCat, kavita, 4999.0, 2199.0, 56,
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
                "English", "INTERMEDIATE", 8, "25h 00m", 4.7, 760, 4500, false, false));


        // Save/Update courses idempotently
        List<Course> savedCourses = new ArrayList<>();
        int countNew = 0;

        for (Course template : templates) {
            Course courseToSave = courseRepo.findBySlug(template.getSlug())
                    .map(existing -> {
                        existing.setTitle(template.getTitle());
                        existing.setSubtitle(template.getSubtitle());
                        existing.setDescription(template.getDescription());
                        existing.setWhatYouWillLearn(template.getWhatYouWillLearn());
                        existing.setRequirements(template.getRequirements());
                        existing.setCategory(template.getCategory());
                        existing.setInstructor(template.getInstructor());
                        existing.setOriginalPrice(template.getOriginalPrice());
                        existing.setDiscountedPrice(template.getDiscountedPrice());
                        existing.setDiscountPercent(template.getDiscountPercent());
                        existing.setThumbnailUrl(template.getThumbnailUrl());
                        existing.setPreviewVideoUrl(template.getPreviewVideoUrl());
                        existing.setLanguage(template.getLanguage());
                        existing.setLevel(template.getLevel());
                        existing.setTotalLessons(template.getTotalLessons());
                        existing.setTotalDuration(template.getTotalDuration());
                        existing.setRating(template.getRating());
                        existing.setTotalReviews(template.getTotalReviews());
                        existing.setTotalStudents(template.getTotalStudents());
                        existing.setFeatured(template.isFeatured());
                        existing.setTrending(template.isTrending());
                        existing.setActive(template.isActive());
                        existing.setType(template.getType());
                        return courseRepo.save(existing);
                    })
                    .orElseGet(() -> {
                        return courseRepo.save(template);
                    });

            savedCourses.add(courseToSave);
        }

        log.info("Seeded/Verified {} total courses in database.", savedCourses.size());
        return savedCourses;
    }

    private int courseVideoCounter = 0;

    private Course buildCourse(String title, String slug, String subtitle, String description,
                               String whatYouWillLearn, String requirements, Category category,
                               Instructor instructor, double originalPrice, double discountedPrice,
                               int discountPercent, String thumbnailUrl, String language, String level,
                               int totalLessons, String totalDuration, double rating, int totalReviews,
                               int totalStudents, boolean featured, boolean trending) {

        String previewUrl = DEMO_VIDEO_URLS[(courseVideoCounter++) % DEMO_VIDEO_URLS.length];

        return Course.builder()
                .title(title)
                .slug(slug)
                .subtitle(subtitle)
                .description(description)
                .whatYouWillLearn(whatYouWillLearn)
                .requirements(requirements)
                .category(category)
                .instructor(instructor)
                .originalPrice(BigDecimal.valueOf(originalPrice))
                .discountedPrice(BigDecimal.valueOf(discountedPrice))
                .discountPercent(discountPercent)
                .thumbnailUrl(thumbnailUrl)
                .previewVideoUrl(previewUrl)
                .language(language)
                .level(level)
                .totalLessons(totalLessons)
                .totalDuration(totalDuration)
                .rating(rating)
                .totalReviews(totalReviews)
                .totalStudents(totalStudents)
                .featured(featured)
                .trending(trending)
                .active(true)
                .type(category != null ? category.getType() : "TECHNOLOGY")
                .build();
    }

    private static final String[] DEMO_VIDEO_URLS = {
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnTheRocks.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    };

    private static final String[] EDUCATIONAL_YOUTUBE_IDS = {
            "grEKMHGYyns", // Java Programming Tutorial
            "k9WqpQp8VSU", // Java OOP & Concepts
            "bMknfKXIFA8", // React Full Course
            "30LWjhZ8ZY0", // Spring Boot REST API
            "HXV3zeQKqGY", // SQL & Relational Databases
            "zOjov-2OZ0E", // Python Programming
            "W6NZfCO5SIk", // JavaScript ES6+ Basics
            "ub36ffWA53U", // HTML5 & CSS3 Web Design
            "1Rs2ND1ryYc", // Data Structures & Algorithms
            "8hly31xKLI0"  // Git & Version Control
    };

    private void seedLessonsAndReviews(List<Course> courses, List<User> demoStudents) {
        for (Course course : courses) {
            List<CourseLesson> existingLessons = courseLessonRepo.findByCourseIdOrderByDisplayOrderAsc(course.getId());
            if (existingLessons.isEmpty()) {
                List<CourseLesson> lessons = createLessonsForCourse(course);
                courseLessonRepo.saveAll(lessons);
                course.setTotalLessons(lessons.size());
                courseRepo.save(course);
            } else {
                boolean updated = false;
                int idx = 0;
                for (CourseLesson lesson : existingLessons) {
                    if (lesson.getVideoUrl() == null || lesson.getVideoUrl().isBlank()) {
                        lesson.setVideoUrl(DEMO_VIDEO_URLS[idx % DEMO_VIDEO_URLS.length]);
                        updated = true;
                    }
                    if (lesson.getYoutubeVideoId() == null || lesson.getYoutubeVideoId().isBlank()) {
                        lesson.setYoutubeVideoId(EDUCATIONAL_YOUTUBE_IDS[idx % EDUCATIONAL_YOUTUBE_IDS.length]);
                        updated = true;
                    }
                    idx++;
                }
                if (updated) {
                    courseLessonRepo.saveAll(existingLessons);
                }
            }

            if (reviewRepo.findByCourseId(course.getId()).isEmpty()) {
                seedReviewsForCourse(course, demoStudents);
            }
        }
    }

    private List<CourseLesson> createLessonsForCourse(Course course) {
        List<CourseLesson> lessons = new ArrayList<>();

        if (course.getSlug().contains("java-programming-masterclass")) {
            lessons.add(lesson(course, "Development Setup & JDK 17 Installation", "Installing IntelliJ IDEA, OpenJDK 17, and environment setup.", "15m 20s", true, "Section 1: Getting Started", 1, DEMO_VIDEO_URLS[0], EDUCATIONAL_YOUTUBE_IDS[0]));
            lessons.add(lesson(course, "Variables, Data Types & Operators", "Primitive data types, arithmetic operators, and type casting.", "22m 10s", true, "Section 1: Getting Started", 2, DEMO_VIDEO_URLS[1], EDUCATIONAL_YOUTUBE_IDS[1]));
            lessons.add(lesson(course, "Control Flow Statements", "If-else conditions, switch expressions, and loops.", "28m 45s", false, "Section 1: Getting Started", 3, DEMO_VIDEO_URLS[2], EDUCATIONAL_YOUTUBE_IDS[0]));
            lessons.add(lesson(course, "Classes, Objects & Constructors", "Creating classes, instantiating objects, and overloading constructors.", "35m 00s", true, "Section 2: Object-Oriented Java", 4, DEMO_VIDEO_URLS[3], EDUCATIONAL_YOUTUBE_IDS[1]));
            lessons.add(lesson(course, "Encapsulation & Access Modifiers", "Private, protected, public access modifiers and getters/setters.", "25m 30s", false, "Section 2: Object-Oriented Java", 5, DEMO_VIDEO_URLS[4], EDUCATIONAL_YOUTUBE_IDS[1]));
            lessons.add(lesson(course, "Inheritance & Polymorphism", "Extending classes, method overriding, and dynamic method dispatch.", "32m 10s", false, "Section 2: Object-Oriented Java", 6, DEMO_VIDEO_URLS[5], EDUCATIONAL_YOUTUBE_IDS[1]));
            lessons.add(lesson(course, "Interfaces & Abstract Classes", "Designing contracts with interfaces and default methods.", "30m 00s", false, "Section 3: Advanced Concepts", 7, DEMO_VIDEO_URLS[6], EDUCATIONAL_YOUTUBE_IDS[1]));
            lessons.add(lesson(course, "Exception Handling Mechanics", "Try-catch blocks, throw, throws, and custom exceptions.", "26m 40s", false, "Section 3: Advanced Concepts", 8, DEMO_VIDEO_URLS[7], EDUCATIONAL_YOUTUBE_IDS[0]));
            lessons.add(lesson(course, "Java Collections & ArrayList", "Working with List interface and ArrayList operations.", "38m 15s", false, "Section 3: Advanced Concepts", 9, DEMO_VIDEO_URLS[8], EDUCATIONAL_YOUTUBE_IDS[0]));
            lessons.add(lesson(course, "Lambda Expressions & Stream API", "Functional interfaces, map, filter, collect, and streams.", "42m 00s", false, "Section 4: Modern Java", 10, DEMO_VIDEO_URLS[9], EDUCATIONAL_YOUTUBE_IDS[0]));
        } else {
            String[] moduleNames = { "Section 1: Introduction & Core Concepts", "Section 2: Practical Implementation", "Section 3: Practice & Advanced Projects" };
            int order = 1;
            int videoIdx = 0;
            for (String module : moduleNames) {
                lessons.add(lesson(course, module + " - Overview", "Comprehensive overview of foundational concepts and industry tools.", "18m 30s", order == 1, module, order, DEMO_VIDEO_URLS[videoIdx % DEMO_VIDEO_URLS.length], EDUCATIONAL_YOUTUBE_IDS[videoIdx % EDUCATIONAL_YOUTUBE_IDS.length]));
                videoIdx++;
                order++;
                lessons.add(lesson(course, module + " - Hands-On Guide", "Step-by-step practical guided coding and case study exercises.", "32m 45s", order == 2, module, order, DEMO_VIDEO_URLS[videoIdx % DEMO_VIDEO_URLS.length], EDUCATIONAL_YOUTUBE_IDS[videoIdx % EDUCATIONAL_YOUTUBE_IDS.length]));
                videoIdx++;
                order++;
                lessons.add(lesson(course, module + " - Optimization & Recap", "Best practices, common pitfalls, performance tuning, and recap.", "28m 10s", false, module, order, DEMO_VIDEO_URLS[videoIdx % DEMO_VIDEO_URLS.length], EDUCATIONAL_YOUTUBE_IDS[videoIdx % EDUCATIONAL_YOUTUBE_IDS.length]));
                videoIdx++;
                order++;
            }
        }

        return lessons;
    }

    private void seedReviewsForCourse(Course course, List<User> demoStudents) {
        if (demoStudents == null || demoStudents.isEmpty()) return;

        double baseRating = course.getRating() != null ? course.getRating() : 4.8;
        
        List<String> techComments = List.of(
                "Extremely comprehensive course! Clear concepts, structured code, and very practical walkthroughs.",
                "The instructor explains complex topics with great clarity. Highly recommended for software developers.",
                "Hands-on coding exercises and production-grade project structure. Cleared all my fundamentals!"
        );

        List<String> bizComments = List.of(
                "Directly applicable business framework. Helped our team refine sprint planning and execution.",
                "Brings authentic industry experience into every lesson. Concise, structured, and high-impact.",
                "Insightful masterclass with real-world case studies. Essential learning for career growth."
        );

        List<String> comments = course.getType().equals("MANAGEMENT") ? bizComments : techComments;

        int count = Math.min(3, demoStudents.size());
        for (int i = 0; i < count; i++) {
            User reviewer = demoStudents.get(i % demoStudents.size());
            if (!reviewRepo.existsByUserAndCourse(reviewer, course)) {
                double r = Math.min(5.0, Math.max(4.0, Math.round((baseRating + (i % 2 == 0 ? 0.1 : -0.1)) * 10.0) / 10.0));
                Review review = Review.builder()
                        .course(course)
                        .user(reviewer)
                        .rating(r)
                        .comment(comments.get(i % comments.size()))
                        .build();
                reviewRepo.save(review);
            }
        }
    }

    private Category cat(String name, String slug, String desc, String icon, String type, int order) {
        return Category.builder()
                .name(name)
                .slug(slug)
                .description(desc)
                .iconName(icon)
                .type(type)
                .displayOrder(order)
                .active(true)
                .build();
    }

    private CourseLesson lesson(Course course, String title, String desc, String duration, boolean preview, String section, int order, String videoUrl, String youtubeVideoId) {
        return CourseLesson.builder()
                .course(course)
                .title(title)
                .description(desc)
                .duration(duration)
                .preview(preview)
                .sectionName(section)
                .displayOrder(order)
                .videoUrl(videoUrl)
                .youtubeVideoId(youtubeVideoId)
                .build();
    }
}
