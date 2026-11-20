// Content for the home page's journey and technical universe. Edit here to update both.

export const JOURNEY = [
  {
    stage: 'Software Engineering', period: '2013 – 2018', where: 'HCL Technologies',
    text: 'Platform software for digital TVs and multifunction printers, and a tool to track and manage errors. Multiple MVP awards from Konica Minolta, Japan.',
  },
  {
    stage: 'Backend & Distributed Systems', period: '2018 – 2019', where: 'Silvermine Group',
    text: 'An analytics pipeline for mobile-app events on Scala, Kafka and MongoDB, a push-notification service on AWS, and a configuration service.',
  },
  {
    stage: 'Blockchain & Web3', period: '2019 – 2025', where: 'IIIT Bangalore · ChainThat · IIT Patna',
    text: 'A PG Diploma in blockchain, then BMNP on R3 Corda for Berkshire Hathaway, and an Executive MTech with work on Hyperledger Fabric, Ethereum and IPFS.',
  },
  {
    stage: 'Digital Health', period: '2019 – 2021', where: 'CARE India, Bihar',
    text: 'Systems for a statewide programme reaching 200,000+ frontline health workers, and Sanjivan, Bihar’s COVID-19 app.',
  },
  {
    stage: 'Fintech & Quantitative Technology', period: '2025 – now', where: 'FidelFolio Investments',
    text: 'A financial data platform with 30+ years of Indian market history, backtesting engines and client reporting for a rules-based adviser.',
  },
  {
    stage: 'AI & Agentic Systems', period: '2025 – now', where: 'FidelFolio Investments',
    text: 'An agentic workflow platform with human approval steps, an MCP gateway for AI assistants, and an AI-assisted stock screener.',
  },
  {
    stage: 'Technology Leadership', period: '2024 – now', where: 'ChainThat · FidelFolio',
    text: 'Product Technical Lead, then Co-Founder and CTO: strategy, architecture, hiring and mentoring, and products end to end.',
  },
];

export const DOMAINS = [
  {
    id: 'backend', name: 'Backend Engineering',
    tools: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'REST APIs', 'Kafka'],
    used: 'Secure APIs for BMNP, an event pipeline at Silvermine, and the services behind FidelFolio.',
    projects: ['blockchain-insurance-platform', 'fidelfolio-research-platform'],
  },
  {
    id: 'frontend', name: 'Frontend Engineering',
    tools: ['React', 'Android', 'Kotlin'],
    used: 'React interfaces for insurers, Android field apps for health workers, and the fidelfolio.ai screener.',
    projects: ['bihar-digital-health', 'fidelfolio-research-platform'],
  },
  {
    id: 'ml', name: 'AI & Machine Learning',
    tools: ['Machine learning', 'LLMs', 'OpenAI API', 'pandas', 'NumPy'],
    used: 'An AI assistant that turns plain-language requests into stock screens, and quantitative research tooling.',
    projects: ['fidelfolio-research-platform'],
  },
  {
    id: 'agentic', name: 'Agentic AI & LLM Systems',
    tools: ['LangGraph', 'MCP', 'Tool use', 'Human-in-the-loop', 'Vector databases', 'Claude Code'],
    used: 'An agentic workflow platform with logged runs and approval steps, and an MCP gateway to the firm’s compute.',
    projects: ['ai-agents-automation'],
  },
  {
    id: 'chain', name: 'Blockchain & Web3',
    tools: ['R3 Corda', 'Hyperledger Fabric', 'Ethereum', 'Solidity', 'IPFS'],
    used: 'BMNP for Berkshire Hathaway, drug supply-chain traceability, and blockchain health records.',
    projects: ['blockchain-insurance-platform', 'blockchain-health-records'],
  },
  {
    id: 'cloud', name: 'Cloud & DevOps',
    tools: ['AWS', 'Docker', 'Nginx', 'Linux', 'CI/CD', 'DigitalOcean'],
    used: 'A push service on AWS, containerised automation, and the firm’s self-hosted servers.',
    projects: ['ai-agents-automation', 'amxpedia'],
  },
  {
    id: 'data', name: 'Data Engineering',
    tools: ['pandas', 'SQLAlchemy', 'PySpark', 'ETL', 'MySQL', 'PostgreSQL', 'MongoDB'],
    used: 'Pipelines for three decades of market data, cross-provider company matching, and interactive analytics.',
    projects: ['financial-data-engineering', 'fidelfolio-research-platform'],
  },
  {
    id: 'arch', name: 'Enterprise Architecture',
    tools: ['Distributed systems', 'Microservices', 'Event-driven design', 'Access control', 'System design'],
    used: 'A cloud-agnostic microservices platform shared by insurers in 130+ countries, and the firm’s data and AI architecture.',
    projects: ['blockchain-insurance-platform', 'ai-agents-automation'],
  },
];
