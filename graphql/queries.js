import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($take: Int, $page: Int) {
    getAllProducts(take: $take, page: $page) {
      products {
        id
        categoryId
        brandId
        previewImage
        mainCategory
        productName
        description
        includeGst
        gst
        hsnCode
        variant {
          variantType
          variantName
          skuId
          size
          productStyleCode
          discountPrice
          manufacturerPrice
          mrpPrice
          dukandarMargin
          logisticCost
          moq
          stock
          warrentyType
          images
          atributes {
            atributeName
            atributeValue
          }
          customatributes {
            customAtributeName
            customAtributeValue
          }
          packagingLength
          packagingBreadth
          packagingHeight
          packagingWeight
        }
        wholesalerId
        active
        approved
        rejected
        rejectedReason
        createdAt
        updatedAt
        previewName
        image
        sellingPrice
        price
        bestSellingProduct
        featuredProduct
        popularProduct
        discount
        reviewId
      }
      count
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($page: Int, $take: Int) {
    getAllCategories(page: $page, take: $take) {
      categories {
        id
        categoryName
        categoryImage
        size
        banner
        categoryIcon
        commission
        dCommission
        description
        createdAt
        updatedAt
        parent
      }
      totalCount
    }
  }
`;

export const LOGIN_USER = gql`
  query Userlogin($email: String, $password: String) {
    userlogin(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCat($catId: ID, $sortOrder: String) {
    getProductsByCat(catId: $catId, sortOrder: $sortOrder) {
      id
      categoryId
      brandId
      previewImage
      mainCategory
      productName
      description
      includeGst
      gst
      hsnCode
      variant {
        variantType
        variantName
        skuId
        size
        productStyleCode
        manufacturerPrice
        mrpPrice
        moq
        stock
        warrentyType
        images
        atributes {
          atributeName
          atributeValue
        }
        customatributes {
          customAtributeName
          customAtributeValue
        }
        packagingLength
        packagingBreadth
        packagingHeight
        packagingWeight
      }
      wholesalerId
      active
      approved
      createdAt
      updatedAt
      previewName
      image
      sellingPrice
      price
      bestSellingProduct
      featuredProduct
      popularProduct
      discount
      reviewId
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategory($getCategoryId: ID) {
    getCategory(id: $getCategoryId) {
      categoryName
      categoryImage
      categoryIcon
    }
  }
`;

// 681c48c5a15c901e92164090
export const GET_PRODUCT = gql`
  query GetProduct($getProductId: ID) {
    getProduct(id: $getProductId) {
      id
      categoryId
      brandId
      previewImage
      mainCategory
      productName
      description
      includeGst
      gst
      hsnCode
      variant {
        variantType
        variantName
        skuId
        size
        productStyleCode
        manufacturerPrice
        mrpPrice
        moq
        stock
        warrentyType
        images
        atributes {
          atributeName
          atributeValue
        }
        customatributes {
          customAtributeName
          customAtributeValue
        }
        packagingLength
        packagingBreadth
        packagingHeight
        packagingWeight
      }
      wholesalerId
      active
      approved
      createdAt
      updatedAt
      previewName
      image
      sellingPrice
      price
      bestSellingProduct
      featuredProduct
      popularProduct
      discount
      reviewId
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCart {
      id
      cartProducts {
        productId
        size
        variantName
        quantity
        price
      }
      user
      createdAt
      updatedAt
    }
  }
`;

export const GET_WISHLIST_QUERY = gql`
  query Query {
    getWishList {
      wishlistProducts {
        productId
      }
      userId
      updatedAt
      id
      createdAt
    }
  }
`;

export const GET_ALL_ADDRESS_QUERY = gql`
  query GetAllAddress($page: Int, $take: Int) {
    getAllAddress(page: $page, take: $take) {
      addresses {
        id
        userId
        addressLine1
        addressLine2
        fullName
        mobileNo
        city
        pincode
        state
        country
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_ADDRESS_QUERY = gql`
  query GetAddress($getAddressId: ID) {
    getAddress(id: $getAddressId) {
      id
      userId
      fullName
      mobileNo
      addressLine1
      addressLine2
      city
      pincode
      state
      country
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      id
      userId
      productId
      image
      rating
      review
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrder($take: Int, $page: Int) {
    getAllOrder(take: $take, page: $page) {
      orders {
        id
        userId
        paymentStatus
        addressLine1
        addressLine2
        city
        pincode
        state
        country
        orderStatus
        orderProducts {
          productId
          productName
          productImages
          variantName
          size
          previewName
          price
          discount
          quantity
          wholeSellerId
          sellerCode
          status
          gst
          totalGst
        }
        totalAmount
        totalQuantity
        createdAt
        updatedAt
        gst
        totalGst
        paymentMethod
      }
      totalCount
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($getOrderId: ID) {
    getOrder(id: $getOrderId) {
      id
      userId
      paymentStatus
      addressLine1
      addressLine2
      city
      pincode
      state
      country
      orderStatus
      orderProducts {
        productId
        productName
        productImages
        variantName
        size
        previewName
        price
        discount
        quantity
        wholeSellerId
        sellerCode
        status
        gst
        totalGst
      }
      totalAmount
      totalQuantity
      createdAt
      updatedAt
      gst
      totalGst
      paymentMethod
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      updatePasswordToken
      firstName
      lastName
      mobileNo
      cartId
      role
      seller
      wishlistId
      wholeseller
      createdAt
      updatedAt
      profilePic
      userInterest
      isSellerPaid
    }
  }
`;

export const VERIFY_COUPON = gql`
  query VarifyCoupon($ushopId: String, $couponcode: String) {
    varifyCoupon(ushopId: $ushopId, couponcode: $couponcode) {
      id
      sellerId
      couponName
      couponCode
      discount
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_HOME_PAGE_SLIDERS = gql`
  query GetAllHomePageSlider {
    getAllHomePageSlider {
      id
      image
      url
      contant
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
query HomeSearch($query: String, $page: Int, $take: Int) {
  homeSearch(query: $query, page: $page, take: $take) {
    products {
      id
      categoryId
      brandId
      previewImage
      mainCategory
      productName
      description
      includeGst
      gst
      hsnCode
      variant {
        variantType
        variantName
        skuId
        size
        productStyleCode
        discountPrice
        manufacturerPrice
        mrpPrice
        dukandarMargin
        logisticCost
        moq
        stock
        warrentyType
        images
        atributes {
          atributeName
          atributeValue
        }
        customatributes {
          customAtributeName
          customAtributeValue
        }
        packagingLength
        packagingBreadth
        packagingHeight
        packagingWeight
      }
      wholesalerId
      active
      approved
      rejected
      rejectedReason
      createdAt
      updatedAt
      previewName
      image
      sellingPrice
      price
      bestSellingProduct
      featuredProduct
      popularProduct
      discount
      reviewId
    }
    count
  }
}`;
