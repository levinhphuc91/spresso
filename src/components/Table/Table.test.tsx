import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./Table";
// import { useNavigate } from "react-router-dom";
import config from "../../config/Table";

const mockedUsedNavigate = jest.fn();

const mockRawData = [
  { id: 1, userId: 1, title: "Title 1", body: "Body 1" },
  { id: 2, userId: 2, title: "Title 2", body: "Body 2" },
  { id: 3, userId: 3, title: "Title 3", body: "Body 3" },
];
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: mockedUsedNavigate,
  useLocation: () => ({
    search: "",
  }),
}));

// const mockNavigate = useNavigate;

describe("Table Component", () => {
  test("renders without crashing", () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });
});
