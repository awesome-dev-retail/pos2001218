import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthIsLoading } from "../slices/authSlice";
import { selectGlobalLoading } from "../slices/publicComponentSlice";


export const useLoading = () => {
  const authLoading = useSelector(state => selectAuthIsLoading(state));
  const globalLoading = useSelector(state => selectGlobalLoading(state));
  return (authLoading || globalLoading);
};

