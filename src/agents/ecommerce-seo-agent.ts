// E-Commerce SEO Agent
// Autonomous agent for product page optimization and schema generation

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  sku: string;
  brand: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  rating: number;
  reviewCount: number;
  images: string[];
  url: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  products: number;
  traffic: number;
  avgPosition: number;
  schemaComplete: number;
  parentCategory?: string;
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  sku: string;
  brand: { '@type': string; name: string };
  offers: {
    '@type': string;
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
  image?: string[];
}

export interface SchemaIssue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  count: number;
  affectedProducts: string[];
  fixSuggestion: string;
}

export interface EcommerceCompetitor {
  id: string;
  name: string;
  products: number;
  avgPosition: number;
  traffic: number;
  schemaScore: number;
  topCategories: string[];
}

export interface ProductOptimization {
  productId: string;
  productName: string;
  recommendations: ProductRecommendation[];
  score: number;
  potentialTrafficGain: number;
}

export interface ProductRecommendation {
  id: string;
  type: 'title' | 'description' | 'schema' | 'images' | 'reviews' | 'category' | 'price';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  suggestedFix?: string;
}

export interface StoreAnalysis {
  totalProducts: number;
  indexedProducts: number;
  avgProductRating: number;
  organicTraffic: number;
  organicRevenue: number;
  conversionRate: number;
  schemaIssues: SchemaIssue[];
  categories: ProductCategory[];
  competitors: EcommerceCompetitor[];
  recommendations: ProductRecommendation[];
  healthScore: number;
}

// E-Commerce SEO Agent Implementation
export class EcommerceSEOAgent {
  private storeUrl: string;

  constructor(storeUrl: string = 'https://store.example.com') {
    this.storeUrl = storeUrl;
  }

  /**
   * Analyze an e-commerce store comprehensively
   */
  analyzeStore(storeUrl: string): StoreAnalysis {
    const schemaIssues = this.detectSchemaIssues();
    const categories = this.analyzeCategories();
    const competitors = this.identifyCompetitors();
    const recommendations = this.generateStoreRecommendations(schemaIssues, categories);
    const healthScore = this.calculateStoreHealth(schemaIssues, categories);

    return {
      totalProducts: 1247,
      indexedProducts: 1189,
      avgProductRating: 4.3,
      organicTraffic: 125000,
      organicRevenue: 485000,
      conversionRate: 3.2,
      schemaIssues,
      categories,
      competitors,
      recommendations,
      healthScore,
    };
  }

  /**
   * Detect schema issues across products
   */
  private detectSchemaIssues(): SchemaIssue[] {
    return [
      { type: 'Missing Product Schema', severity: 'critical', count: 58, affectedProducts: [], fixSuggestion: 'Add Product schema markup to all product pages' },
      { type: 'Invalid Price Format', severity: 'warning', count: 23, affectedProducts: [], fixSuggestion: 'Ensure price is a valid number with currency' },
      { type: 'Missing Review Schema', severity: 'warning', count: 89, affectedProducts: [], fixSuggestion: 'Add AggregateRating schema for products with reviews' },
      { type: 'Missing Availability', severity: 'info', count: 34, affectedProducts: [], fixSuggestion: 'Add availability status to product schema' },
      { type: 'Missing Brand', severity: 'info', count: 45, affectedProducts: [], fixSuggestion: 'Add brand information to product schema' },
    ];
  }

  /**
   * Analyze product categories
   */
  private analyzeCategories(): ProductCategory[] {
    return [
      { id: 'c1', name: 'SEO Tools', slug: 'seo-tools', products: 45, traffic: 45000, avgPosition: 8.2, schemaComplete: 85 },
      { id: 'c2', name: 'Analytics Software', slug: 'analytics', products: 32, traffic: 28000, avgPosition: 12.5, schemaComplete: 72 },
      { id: 'c3', name: 'Content Tools', slug: 'content-tools', products: 28, traffic: 22000, avgPosition: 15.3, schemaComplete: 68 },
      { id: 'c4', name: 'Link Building', slug: 'link-building', products: 18, traffic: 15000, avgPosition: 18.7, schemaComplete: 55 },
      { id: 'c5', name: 'Technical SEO', slug: 'technical-seo', products: 22, traffic: 18000, avgPosition: 10.2, schemaComplete: 90 },
    ];
  }

  /**
   * Identify e-commerce competitors
   */
  private identifyCompetitors(): EcommerceCompetitor[] {
    return [
      { id: 'ec1', name: 'SEMrush Store', products: 2500, avgPosition: 5.2, traffic: 450000, schemaScore: 95, topCategories: ['SEO Tools', 'Analytics'] },
      { id: 'ec2', name: 'Ahrefs Shop', products: 1800, avgPosition: 6.8, traffic: 380000, schemaScore: 92, topCategories: ['Backlink Tools', 'Keyword Research'] },
      { id: 'ec3', name: 'Moz Marketplace', products: 1200, avgPosition: 8.5, traffic: 220000, schemaScore: 88, topCategories: ['SEO Software', 'Local SEO'] },
      { id: 'ec4', name: 'Majestic Store', products: 800, avgPosition: 12.3, traffic: 95000, schemaScore: 75, topCategories: ['Link Analysis'] },
    ];
  }

  /**
   * Generate store-wide recommendations
   */
  private generateStoreRecommendations(issues: SchemaIssue[], categories: ProductCategory[]): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Schema-based recommendations
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push({
        id: 'rec-schema-critical',
        type: 'schema',
        title: `Add Product Schema to ${criticalIssues[0].count} products`,
        description: 'Critical: Products without schema markup are missing rich results opportunities',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    // Category-based recommendations
    const lowSchemaCategories = categories.filter(c => c.schemaComplete < 70);
    if (lowSchemaCategories.length > 0) {
      recommendations.push({
        id: 'rec-category-schema',
        type: 'category',
        title: 'Improve schema coverage in underperforming categories',
        description: `${lowSchemaCategories.length} categories have less than 70% schema coverage`,
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    // Review recommendations
    const reviewIssue = issues.find(i => i.type === 'Missing Review Schema');
    if (reviewIssue && reviewIssue.count > 50) {
      recommendations.push({
        id: 'rec-reviews',
        type: 'reviews',
        title: 'Add customer reviews to product pages',
        description: 'Products with reviews have higher CTR and conversion rates',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    // Title optimization
    recommendations.push({
      id: 'rec-titles',
      type: 'title',
      title: 'Optimize product titles with keywords',
      description: 'Include target keywords in product titles for better rankings',
      impact: 'high',
      effort: 'low',
      status: 'in_progress',
    });

    // Image optimization
    recommendations.push({
      id: 'rec-images',
      type: 'images',
      title: 'Add alt text to product images',
      description: 'Descriptive alt text improves accessibility and image search visibility',
      impact: 'medium',
      effort: 'low',
      status: 'pending',
    });

    return recommendations;
  }

  /**
   * Calculate store health score
   */
  private calculateStoreHealth(issues: SchemaIssue[], categories: ProductCategory[]): number {
    let score = 100;

    // Deduct for schema issues
    issues.forEach(issue => {
      if (issue.severity === 'critical') score -= 15;
      else if (issue.severity === 'warning') score -= 8;
      else score -= 3;
    });

    // Bonus for high schema coverage
    const avgSchemaComplete = categories.reduce((s, c) => s + c.schemaComplete, 0) / categories.length;
    if (avgSchemaComplete >= 90) score += 10;
    else if (avgSchemaComplete >= 80) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate Product schema markup
   */
  generateProductSchema(product: Product): ProductSchema {
    const schema: ProductSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: this.getAvailabilityUrl(product.availability),
        url: product.url,
      },
    };

    // Add rating if available
    if (product.rating > 0 && product.reviewCount > 0) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      };
    }

    // Add images if available
    if (product.images.length > 0) {
      schema.image = product.images;
    }

    return schema;
  }

  /**
   * Get schema.org availability URL
   */
  private getAvailabilityUrl(availability: Product['availability']): string {
    const urls: Record<Product['availability'], string> = {
      in_stock: 'https://schema.org/InStock',
      out_of_stock: 'https://schema.org/OutOfStock',
      preorder: 'https://schema.org/PreOrder',
    };
    return urls[availability];
  }

  /**
   * Generate schema markup as JSON-LD script
   */
  generateSchemaScript(product: Product): string {
    const schema = this.generateProductSchema(product);
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
  }

  /**
   * Bulk generate schema for multiple products
   */
  bulkGenerateSchema(products: Product[]): { productId: string; schema: string }[] {
    return products.map(product => ({
      productId: product.id,
      schema: this.generateSchemaScript(product),
    }));
  }

  /**
   * Optimize a single product
   */
  optimizeProduct(product: Product): ProductOptimization {
    const recommendations = this.generateProductRecommendations(product);
    const score = this.calculateProductScore(product, recommendations);
    const potentialTrafficGain = this.estimateTrafficGain(recommendations);

    return {
      productId: product.id,
      productName: product.name,
      recommendations,
      score,
      potentialTrafficGain,
    };
  }

  /**
   * Generate product-specific recommendations
   */
  private generateProductRecommendations(product: Product): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Title optimization
    if (product.name.length < 30 || product.name.length > 70) {
      recommendations.push({
        id: `${product.id}-title`,
        type: 'title',
        title: 'Optimize product title length',
        description: 'Product titles between 30-70 characters perform best',
        impact: 'high',
        effort: 'low',
        status: 'pending',
        suggestedFix: this.suggestProductTitle(product),
      });
    }

    // Description optimization
    if (!product.description || product.description.length < 150) {
      recommendations.push({
        id: `${product.id}-desc`,
        type: 'description',
        title: 'Expand product description',
        description: 'Descriptions should be at least 150 characters with keywords',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    // Image optimization
    if (product.images.length < 3) {
      recommendations.push({
        id: `${product.id}-images`,
        type: 'images',
        title: 'Add more product images',
        description: 'Products with 3+ images have higher conversion rates',
        impact: 'medium',
        effort: 'medium',
        status: 'pending',
      });
    }

    // Review optimization
    if (product.reviewCount < 5) {
      recommendations.push({
        id: `${product.id}-reviews`,
        type: 'reviews',
        title: 'Encourage customer reviews',
        description: 'Products with 5+ reviews rank better and convert more',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    return recommendations;
  }

  /**
   * Calculate product optimization score
   */
  private calculateProductScore(product: Product, recommendations: ProductRecommendation[]): number {
    let score = 100;

    recommendations.forEach(rec => {
      if (rec.status === 'pending') {
        if (rec.impact === 'high') score -= 15;
        else if (rec.impact === 'medium') score -= 8;
        else score -= 4;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Estimate traffic gain from optimizations
   */
  private estimateTrafficGain(recommendations: ProductRecommendation[]): number {
    let gain = 0;

    recommendations.forEach(rec => {
      if (rec.status === 'pending') {
        if (rec.impact === 'high') gain += 500;
        else if (rec.impact === 'medium') gain += 200;
        else gain += 50;
      }
    });

    return gain;
  }

  /**
   * Suggest optimized product title
   */
  suggestProductTitle(product: Product): string {
    const keywords = product.category.toLowerCase();
    return `${product.brand} ${product.name} - ${keywords.charAt(0).toUpperCase() + keywords.slice(1)} | Best Price`;
  }

  /**
   * Analyze category SEO performance
   */
  analyzeCategory(category: ProductCategory): {
    category: ProductCategory;
    recommendations: ProductRecommendation[];
    competitorGap: number;
  } {
    const recommendations: ProductRecommendation[] = [];

    if (category.schemaComplete < 80) {
      recommendations.push({
        id: `${category.id}-schema`,
        type: 'schema',
        title: `Improve schema coverage to 80%+`,
        description: `Currently at ${category.schemaComplete}% - add schema to remaining products`,
        impact: 'high',
        effort: 'medium',
        status: 'pending',
      });
    }

    if (category.avgPosition > 10) {
      recommendations.push({
        id: `${category.id}-position`,
        type: 'category',
        title: 'Improve category page content',
        description: 'Add more descriptive content to category pages',
        impact: 'medium',
        effort: 'medium',
        status: 'pending',
      });
    }

    return {
      category,
      recommendations,
      competitorGap: Math.round(category.avgPosition - 5), // Gap to top 5
    };
  }

  /**
   * Export store analysis report
   */
  exportReport(analysis: StoreAnalysis, format: 'json' | 'html' = 'json'): string {
    if (format === 'html') {
      return this.generateHtmlReport(analysis);
    }
    return JSON.stringify(analysis, null, 2);
  }

  private generateHtmlReport(analysis: StoreAnalysis): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>E-Commerce SEO Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .score { font-size: 48px; font-weight: bold; color: ${analysis.healthScore >= 80 ? '#22c55e' : analysis.healthScore >= 60 ? '#f59e0b' : '#ef4444'}; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .issue { padding: 12px; border-left: 4px solid #3b82f6; margin-bottom: 8px; background: #f8fafc; }
    .critical { border-left-color: #ef4444; }
    .warning { border-left-color: #f59e0b; }
    .info { border-left-color: #3b82f6; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>E-Commerce SEO Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  
  <div class="card">
    <h2>Store Health Score</h2>
    <div class="score">${analysis.healthScore}</div>
  </div>
  
  <div class="card">
    <h2>Store Stats</h2>
    <p>Total Products: ${analysis.totalProducts.toLocaleString()}</p>
    <p>Indexed Products: ${analysis.indexedProducts.toLocaleString()}</p>
    <p>Organic Traffic: ${analysis.organicTraffic.toLocaleString()}</p>
    <p>Organic Revenue: $${analysis.organicRevenue.toLocaleString()}</p>
    <p>Conversion Rate: ${analysis.conversionRate}%</p>
  </div>
  
  <div class="card">
    <h2>Schema Issues</h2>
    ${analysis.schemaIssues.map(issue => `
      <div class="issue ${issue.severity}">
        <strong>${issue.type}</strong>
        <p>${issue.count} products affected</p>
        <small>Fix: ${issue.fixSuggestion}</small>
      </div>
    `).join('')}
  </div>
  
  <div class="card">
    <h2>Categories</h2>
    <table>
      <tr>
        <th>Category</th>
        <th>Products</th>
        <th>Traffic</th>
        <th>Avg. Position</th>
        <th>Schema %</th>
      </tr>
      ${analysis.categories.map(cat => `
        <tr>
          <td>${cat.name}</td>
          <td>${cat.products}</td>
          <td>${cat.traffic.toLocaleString()}</td>
          <td>${cat.avgPosition}</td>
          <td>${cat.schemaComplete}%</td>
        </tr>
      `).join('')}
    </table>
  </div>
</body>
</html>`;
  }
}

// Export singleton instance
export const ecommerceSEOAgent = new EcommerceSEOAgent();

// Export convenience functions
export const analyzeStore = (storeUrl: string) => ecommerceSEOAgent.analyzeStore(storeUrl);
export const generateProductSchema = (product: Product) => ecommerceSEOAgent.generateProductSchema(product);
export const generateSchemaScript = (product: Product) => ecommerceSEOAgent.generateSchemaScript(product);
export const bulkGenerateSchema = (products: Product[]) => ecommerceSEOAgent.bulkGenerateSchema(products);
export const optimizeProduct = (product: Product) => ecommerceSEOAgent.optimizeProduct(product);
export const analyzeCategory = (category: ProductCategory) => ecommerceSEOAgent.analyzeCategory(category);
