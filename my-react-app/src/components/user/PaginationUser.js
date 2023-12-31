import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import { Form } from "react-bootstrap";

function PaginationUser({
  page,
  setPage,
  perPage,
  setPerPage,
  totalPage,
  paginationButtons,
}) {
  const handleChangePage = (index) => {
    setPage(index);
  };

  const handleChangePerPage = (event) => {
    setPerPage(event.target.value);
  };

  for (let index = 1; index <= totalPage; index++) {
    paginationButtons.push(
      <MDBPagination  className="m-1">
        <MDBPaginationItem>
          <MDBPaginationLink
            className={index === page ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => handleChangePage(index)}
            key={index}
            disable
          >
            {index}
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        
      }}
    >
      <Form.Select
        className="w-auto"
        style={{
          height: "40px",
          marginTop: "5px",
        }}
        aria-label="Default select example"
        defaultValue={perPage}
        onChange={handleChangePerPage}
      >
        <option value={perPage}>10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </Form.Select>
      {paginationButtons}
    </div>
  );
}

export default PaginationUser;
