import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($page: Int, $take: Int) {
    getAllCategories(page: $page, take: $take) {
      categories {
        categoryName
        categoryImage
      }
    }
  }
`;
