import { gql, GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://pincodekart.com/api/graphql';

const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($product: WishlistInput!) {
    addToWishlist(product: $product) {
      success
      message
    }
  }
`;

export const addToWishlistAPI = async (email, product) => {
  try {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        email, // <-- Send email in headers
      },
    });

    const variables = {
      product,
    };

    const response = await client.request(ADD_TO_WISHLIST, variables);
    return response?.addToWishlist;
  } catch (error) {
    console.error('addToWishlist API Error:', error);
    throw error;
  }
};
