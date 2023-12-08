import { nanoid } from "nanoid";

import Grid from "../UI/Grid";
import ItemCard from "../ItemCard";
import GridElement from "../UI/GridElement";
import { CatalogItem } from "../../types/CatalogItem";

import tmpImg from "../../assets/images/tmp.jpg";

// creating temp dummy data of catalog items
const catalogItems: CatalogItem[] = [
  {
    productId: nanoid(),
    name: "Горбуша",
    price: 200,
    weight: 320,
    kcal: 80,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Тунец",
    price: 250,
    weight: 280,
    kcal: 90,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Сайра",
    price: 230,
    weight: 350,
    kcal: 120,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Горбуша",
    price: 200,
    weight: 320,
    kcal: 80,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Тунец",
    price: 250,
    weight: 280,
    kcal: 90,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Сайра",
    price: 230,
    weight: 350,
    kcal: 120,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Горбуша",
    price: 200,
    weight: 320,
    kcal: 80,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Тунец",
    price: 250,
    weight: 280,
    kcal: 90,
    image: <img src={tmpImg} />,
  },
  {
    productId: nanoid(),
    name: "Сайра",
    price: 230,
    weight: 350,
    kcal: 120,
    image: <img src={tmpImg} />,
  },
];

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = () => {
  return (
    <div className="px-2 vsm:px-4">
      <Grid xCount="2">
        {catalogItems.map((item) => (
          <GridElement key={item.productId}>
            <ItemCard catalogItem={item} />
          </GridElement>
        ))}
      </Grid>
    </div>
  );
};

export default CatalogPage;
