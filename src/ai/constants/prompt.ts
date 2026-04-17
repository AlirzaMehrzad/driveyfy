export const productsDescriptionPrompt = async (productName: string) => {
  return `You are an expert e-commerce copywriter. 
      Write a short, engaging 2-sentence product description for a product named: ${productName}. 
      Do not use overly complex words.
      The description should be concise and highlight the key features and benefits of the product.
      Avoid using generic phrases and focus on what makes this product unique and appealing to potential customers.
      The description should be written in a way that captures the attention of potential customers and encourages them to learn more about the product.
      Please provide the description in a clear and compelling manner, using language that resonates with the target audience.
      dont say anything else except the description.`;
};
