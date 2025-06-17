import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart(
    $productId: ID
    $size: String
    $variantName: String
    $quantity: Int
    $price: Float
  ) {
    addToCart(
      productId: $productId
      size: $size
      variantName: $variantName
      quantity: $quantity
      price: $price
    ) {
      user
      updatedAt
      id
      createdAt
      cartProducts {
        variantName
        size
        quantity
        productId
        price
      }
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($productId: ID, $quantity: Int) {
    updateCart(productId: $productId, quantity: $quantity) {
      user
      updatedAt
      id
      createdAt
      cartProducts {
        variantName
        size
        quantity
        productId
        price
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart(
    $productId: ID
    $variantName: String
    $size: String
  ) {
    removeFromCart(
      productId: $productId
      variantName: $variantName
      size: $size
    ) {
      user
      updatedAt
      id
      createdAt
      cartProducts {
        variantName
        size
        quantity
        productId
        price
      }
    }
  }
`;

// Wishlist mutations
export const ADD_TO_WISHLIST = gql`
  mutation Mutation($productId: ID) {
    addToWishlist(productId: $productId) {
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

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID) {
    removeFromWishlist(productId: $productId) {
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

export const UPDATE_ADDRESS = gql`
  mutation Mutation($updateAddressId: ID, $fullName: String, $mobileNo: String, $addressLine1: String, $addressLine2: String, $city: String, $pincode: Int, $state: String, $country: String) {
  updateAddress(id: $updateAddressId, fullName: $fullName, mobileNo: $mobileNo, addressLine1: $addressLine1, addressLine2: $addressLine2, city: $city, pincode: $pincode, state: $state, country: $country) {
    addressLine1
    addressLine2
    city
    country
    createdAt
    fullName
    id
    mobileNo
    pincode
    state
    updatedAt
    userId
  }
}`;


export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($deleteAddressId: ID) {
    deleteAddress(id: $deleteAddressId) {
      id
      userId
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

export const CREATE_ADDRESS =gql`
mutation CreateAddress($fullName: String, $mobileNo: String, $addressLine1: String, $addressLine2: String, $city: String, $pincode: Int, $state: String, $country: String) {
  createAddress(fullName: $fullName, mobileNo: $mobileNo, addressLine1: $addressLine1, addressLine2: $addressLine2, city: $city, pincode: $pincode, state: $state, country: $country) {
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


  export const CREATE_ORDER = gql`
  mutation CreateOrder($addressId: ID, $paymentMethod: String) {
    createOrder(
      addressId: $addressId
      paymentMethod: $paymentMethod
    ) {
      id
      addressLine1
      addressLine2
      city
      country
      createdAt
      gst
      orderProducts {
        discount
        gst
        previewName
        price
        productImages
        productName
        quantity
        sellerCode
        size
        totalGst
        variantName
        wholeSellerId
      }
      orderStatus
      paymentMethod
      paymentStatus
      pincode
      state
      totalAmount
      totalGst
      totalQuantity
      updatedAt
      userId
    }
  }
`;

export const EDIT_PROFILE = gql`
mutation UpdateUserProfile($firstName: String, $lastName: String, $mobileNo: String) {
  updateUserProfile(firstName: $firstName, lastName: $lastName, mobileNo: $mobileNo) {
    cartId
    createdAt
    email
    firstName
    id
    isSellerPaid
    lastName
    mobileNo
    profilePic
    role
    seller
    updatePasswordToken
    updatedAt
    userInterest
    wholeseller
    wishlistId
  }
}`

export const CREATE_COUPAN = gql`
mutation Mutation($couponName: String, $couponCode: String, $discount: Float) {
  createCoupon(couponName: $couponName, couponCode: $couponCode, discount: $discount) {
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
`