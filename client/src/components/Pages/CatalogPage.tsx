import Grid from "../UI/Grid";
import GridElement from "../UI/GridElement";
import Gorbusha from "../../assets/images/Gorbusha.jpg";
import Tuna from "../../assets/images/Tuna.jpg";
import Saira from "../../assets/images/Saira.jpeg";

interface catatalogItem {
  name: string;
  price: number;
  weigth: number;
  kcal: number;
  image?: JSX.Element;
}

const catalogItems: catatalogItem[] = [
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

const InfoCard: React.FC<{
  children: string;
}> = ({ children }) => {
  return (
    <div className="flex w-fit my-2 px-2 border-double border-4 rounded-lg border-sky-500 text-sm text-center">
      {children}
    </div>
  );
};

const CatalogPage = () => {
  return (
    <div className="px-4">
      <Grid xCount={"2"} yCount={"3"}>
        {catalogItems.map((item, index) => (
          <GridElement key={index}>
            <div className="my-2">{item.name}</div>
            <div className="flex justify-center mb-4">
              <div className="basis-1/12" />
              <div className="grow flex items-center">{item.image}</div>
              <div className="basis-1/12" />
              <div className="basis-2/12 flex items-center justify-end">
                <div className="flex flex-col">
                  <InfoCard>{`${item.weigth} гр.`}</InfoCard>
                  <InfoCard>{`${item.kcal} ккал.`}</InfoCard>
                  <InfoCard>{`${item.price} руб.`}</InfoCard>
                </div>
              </div>
              <div className="basis-1/12" />
            </div>
            <button
              type="button"
              className="transition ease-in-out transition-all text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              В корзину
            </button>
          </GridElement>
        ))}
      </Grid>
    </div>
  );
};

export default CatalogPage;
