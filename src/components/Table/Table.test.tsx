import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./Table";
import config from "../../config/Table";

const mockUseNavigate = jest.fn();

const mockRawData = [
  { id: 1, userId: 1, title: "Title 1", body: "Body 1" },
  { id: 2, userId: 2, title: "Title 2", body: "Body 2" },
  { id: 3, userId: 3, title: "Title 3", body: "Body 3" },
];
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useLocation: () => ({
    search: "",
  }),
}));

beforeEach(() => {
  mockUseNavigate.mockClear();
});

describe("Table Component", () => {
  test("renders without crashing", () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test('renders table with data', () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    expect(screen.getByText('Title 1')).toBeInTheDocument();
  });

  test('handles next page navigation', () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockUseNavigate).toHaveBeenCalledWith(expect.objectContaining({
      search: "page=1"
    }));
  });

  test('sorts data when sortable column header is clicked', () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    fireEvent.click(screen.getByText('User Id'));
    expect(mockUseNavigate.mock.calls[1][0]).toEqual({
      search: "page=1&sortKey=userId&sortDirection=ascending"
    });
  });

  test('filters data based on search input', async () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Title 1' } });
    expect(screen.getByText('Title 1')).toBeInTheDocument();
  });

  test('selects and deselects a row', () => {
    render(<Table rawData={mockRawData} config={config} loading={false} />);
    const checkbox = screen.getByLabelText('Select row 1');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

});
