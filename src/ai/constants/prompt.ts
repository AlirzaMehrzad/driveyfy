

export const productsDescriptionPrompt = async (productName: string) => {
    return `You are an expert e-commerce copywriter. 
      Write a short, engaging 2-sentence product description for a product named: ${productName}. 
      Do not use overly complex words.`;
}
