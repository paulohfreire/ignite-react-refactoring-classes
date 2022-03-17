import Header from "../../components/Header";
import api from "../../services/api";
import { Food, IFoodDesc } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useState } from "react";
import { useEffect } from "react";

export function Dashboard() {
  const [foods, setFoods] = useState<IFoodDesc[]>([]);
  const [editingFood, setEditFood] = useState<IFoodDesc>({} as IFoodDesc);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function handleAddFood(food: IFoodDesc) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods((foods) => [...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFoodDesc) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      setFoods((foods) => [...foods, foodUpdated.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function HandleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    setFoods((foods) => foods.filter((food) => food.id !== id));
  }

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleEditModal = () => setEditModalOpen(!modalOpen);

  async function HandleEditFood(food: IFoodDesc) {
    setEditModalOpen(true);
    setEditFood(food);
  }

  useEffect(() => {
    async function setFetchFood() {
      const response = await api.get("/foods");
      setFoods(response.data);
    }

    setFetchFood();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={HandleDeleteFood}
              handleEditFood={HandleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
