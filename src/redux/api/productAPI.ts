import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    // /api/v1/product/
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes:["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags:["product"],
    }),

    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags:["product"],
    }),

    categories: builder.query<CategoriesResponse, string>({
      query: () => "category",
      providesTags:["product"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let baseQuery = `all?search=${search}&page=${page}`;

        if (price) baseQuery += `&price=${price}`;
        if (category) baseQuery += `&category=${category}`;
        if (sort) baseQuery += `&sort=${sort}`;

        return baseQuery;
      },
      providesTags:["product"],
    }),

    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags:["product"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({formData,id}) => ({
        url:`new?id=${id}`,
        method:"POST",
        body: formData
      }),
      invalidatesTags:["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
} = productAPI;
