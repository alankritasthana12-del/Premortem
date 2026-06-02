import json
import re

FAILURE_CORPUS = [
    {
        "title": "Quibi - Market Timing & Unvalidated Assumptions",
        "industry_tags": ["media", "streaming", "consumer", "entertainment", "mobile", "content"],
        "failure_category": "No Market Need",
        "summary": "Raised $1.75B. Built premium short-form content exclusively for mobile on-the-go viewing. Failed to realize users consume short-form (TikTok/YouTube) for free, and pay for long-form (Netflix) on big screens. COVID-19 killed the 'commute' use case, but the fundamental flaw was building a massive supply before validating demand."
    },
    {
        "title": "Theranos - Regulatory & Technological Fraud",
        "industry_tags": ["healthtech", "biotech", "medical", "hardware", "diagnostics", "healthcare"],
        "failure_category": "Regulatory & Technical Feasibility",
        "summary": "Raised $700M+. Promised comprehensive blood tests from a single drop of blood. Ignored basic physics/biology constraints. Bypassed peer review. The ultimate failure was attempting to apply 'fake it till you make it' software culture to heavily regulated healthcare hardware."
    },
    {
        "title": "WeWork - Unit Economics & Governance",
        "industry_tags": ["proptech", "real estate", "b2b", "coworking", "saas", "space"],
        "failure_category": "Flawed Business Model",
        "summary": "Valued at $47B. Took on long-term fixed liabilities (commercial leases) while selling short-term flexible assets (desk rentals). Gross margin was negative when factoring in build-out costs. Masked terrible unit economics with 'Community Adjusted EBITDA' and tech company valuations."
    },
    {
        "title": "Juicero - Over-engineering & Margin Compression",
        "industry_tags": ["hardware", "consumer", "foodtech", "iot", "smart"],
        "failure_category": "Over-engineered Solution",
        "summary": "Raised $120M. Built a $400 internet-connected juice press. Users discovered the proprietary juice packs could be squeezed by hand faster than the machine. Classic case of solving a non-existent problem with unnecessarily complex hardware."
    },
    {
        "title": "Fast - Burn Rate & Execution",
        "industry_tags": ["fintech", "ecommerce", "payments", "b2b", "checkout", "saas"],
        "failure_category": "Premature Scaling",
        "summary": "Raised $124M. One-click checkout button. Spent aggressively on marketing (NASCAR sponsorships) and hired hundreds of engineers before establishing product-market fit. Burned $10M/month while generating less than $1M in annual revenue. Competitor Bolt had already captured the enterprise market."
    },
    {
        "title": "Zume Pizza - Automation ROI",
        "industry_tags": ["foodtech", "robotics", "logistics", "consumer", "delivery"],
        "failure_category": "Misapplied Technology",
        "summary": "Raised $375M. Tried to automate pizza making with robots in delivery trucks. The robots were incredibly expensive, cheese slid off pizzas in transit, and the fundamental product (the pizza) wasn't better than local alternatives. Tech didn't solve the core consumer need."
    },
    {
        "title": "Beepi - Operational Inefficiency",
        "industry_tags": ["marketplace", "automotive", "ecommerce", "consumer", "cars"],
        "failure_category": "Poor Margin Structure",
        "summary": "Raised $150M. Used car marketplace. Spent recklessly on executive salaries and office perks. The operational costs of inspecting, picking up, and storing cars wiped out the transaction fee margins. Failed to secure follow-on funding despite high top-line GMV."
    }
]

def get_relevant_context(idea: str, market: str) -> str:
    """
    Performs a lightweight keyword matching search against the JSON corpus.
    Scores each case based on keyword matches in tags, title, and summary.
    Returns the top 3 formatted cases.
    """
    search_text = (idea + " " + market).lower()
    
    # Simple tokenization (alphanumeric words > 2 chars)
    tokens = set(re.findall(r'\b[a-z0-9]{3,}\b', search_text))
    
    # Common stop words to remove to improve matching
    stop_words = {"the", "and", "for", "with", "this", "that", "are", "our", "their", "will", "platform", "app", "users", "build", "create", "help", "startup", "idea", "make", "how", "what", "can"}
    tokens = tokens - stop_words
    
    scored_cases = []
    
    for case in FAILURE_CORPUS:
        score = 0
        
        # Check tags (highest weight)
        for tag in case["industry_tags"]:
            if tag in tokens:
                score += 3
                
        # Check title
        case_title_tokens = set(re.findall(r'\b[a-z0-9]{3,}\b', case["title"].lower()))
        score += len(tokens.intersection(case_title_tokens)) * 2
        
        # Check summary
        case_summary_tokens = set(re.findall(r'\b[a-z0-9]{3,}\b', case["summary"].lower()))
        score += len(tokens.intersection(case_summary_tokens))
        
        scored_cases.append({"case": case, "score": score})
        
    # Sort by score descending
    scored_cases.sort(key=lambda x: x["score"], reverse=True)
    
    # Get top 3 matches
    top_cases = [item["case"] for item in scored_cases[:3]]
    
    # Format into a context string
    context_str = "VERIFIED HISTORICAL FAILURE PRECEDENTS:\n\n"
    for idx, case in enumerate(top_cases, 1):
        context_str += f"{idx}. {case['title']} (Category: {case['failure_category']})\n"
        context_str += f"   Tags: {', '.join(case['industry_tags'])}\n"
        context_str += f"   Summary: {case['summary']}\n\n"
        
    return context_str.strip()
