import React from "react";
import DishList from "./DishList";
import DishCategory from "./DishCategory";

export default function Dish() {
  return (
    <div className="right-container">
      <DishList></DishList>
      <DishCategory></DishCategory>
    </div>
  );
}
