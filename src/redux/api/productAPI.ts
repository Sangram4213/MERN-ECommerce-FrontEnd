import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, SearchProductsRequest, SearchProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    // /api/v1/product/
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => "category",
    }),
    searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
      query: ({price,search,sort,category,page}) => {

        let baseQuery = `all?search=${search}&page=${page}`;

        if(price) baseQuery+= `&price=${price}`;
        if(category) baseQuery += `&category=${category}`
        if(sort) baseQuery+= `&sort=${sort}`;

        return baseQuery
      },
    }),
  }),
});

export const { useLatestProductsQuery,useAllProductsQuery, useCategoriesQuery,useSearchProductsQuery } = productAPI;
