import Grid from "../UI/Grid";
import ItemCard from "../ItemCard";
import GridElement from "../UI/GridElement";

import Tuna from "../../assets/images/Tuna.jpg";
import Saira from "../../assets/images/Saira.jpeg";
import Gorbusha from "../../assets/images/Gorbusha.jpg";

// declaring interface for catalog item
export interface catalogItem {
  name: string;
  price: number;
  weigth: number;
  kcal: number;
  image?: JSX.Element;
}

// creating temp dummy data of catalog items
const catalogItems: catalogItem[] = [
  {
    name: "Горбуша",
    price: 200,
    weigth: 320,
    kcal: 80,
    image: <img src={Gorbusha} />,
  },
  {
    name: "Тунец",
    price: 250,
    weigth: 280,
    kcal: 90,
    image: <img src={Tuna} />,
  },
  {
    name: "Сайра",
    price: 230,
    weigth: 350,
    kcal: 120,
    image: <img src={Saira} />,
  },
  {
    name: "Горбуша",
    price: 200,
    weigth: 320,
    kcal: 80,
    image: <img src={Gorbusha} />,
  },
  {
    name: "Тунец",
    price: 250,
    weigth: 280,
    kcal: 90,
    image: <img src={Tuna} />,
  },
  {
    name: "Сайра",
    price: 230,
    weigth: 350,
    kcal: 120,
    image: <img src={Saira} />,
  },
  {
    name: "Горбуша",
    price: 200,
    weigth: 320,
    kcal: 80,
    image: <img src={Gorbusha} />,
  },
  {
    name: "Тунец",
    price: 250,
    weigth: 280,
    kcal: 90,
    image: <img src={Tuna} />,
  },
  {
    name: "Сайра",
    price: 230,
    weigth: 350,
    kcal: 120,
    image: <img src={Saira} />,
  },
  {
    name: "Горбуша",
    price: 200,
    weigth: 320,
    kcal: 80,
    image: <img src={Gorbusha} />,
  },
  {
    name: "Тунец",
    price: 250,
    weigth: 280,
    kcal: 90,
    image: <img src={Tuna} />,
  },
  {
    name: "Сайра",
    price: 230,
    weigth: 350,
    kcal: 120,
    image: <img src={Saira} />,
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
        {catalogItems.map((item, index) => (
          <GridElement key={index}>
            <ItemCard catalogItem={item} />
          </GridElement>
        ))}
      </Grid>
    </div>
  );
};

export default CatalogPage;
