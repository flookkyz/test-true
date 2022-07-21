import React, { useState } from "react";
import * as XLSX from "xlsx";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [items, setItems] = useState([]);
  const [selectData, setSelectData] = useState([]);

  const onSelectData = (value) => {
    setSelectData(value);
    console.log("selectData = ", value);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      setItems(data);
      console.log(data);
    });
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-zinc-100 w-[50%] h-[150px] rounded border mt-20 px-3 py-5">
          <span className="text-[26px]">Import CSV/Excel file</span>
          <hr />
          <center className="mt-8">
            <label className="mr-2">CSV/Excel File :</label>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            />
          </center>
        </div>
      </div>
      <center>
        <button
          className="bg-red-300 rounded px-3 py-2 mt-5"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Genarate QR Code
        </button>
        <div className="overflow-x-auto mt-5 w-[80%] relative shadow-md">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Asset
                </th>
                <th scope="col" className="py-3 px-6">
                  Description 1
                </th>
                <th scope="col" className="py-3 px-6">
                  main no. text
                </th>
                <th scope="col" className="py-3 px-6">
                  Class
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    onSelectData(data.Asset);
                  }}
                  className={
                    selectData.includes(data.Asset)
                      ? "bg-yellow-300"
                      : "bg-white hover:bg-gray-200"
                  }
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {data.Asset}
                  </th>
                  <td className="py-4 px-6">{data["Description 1"]}</td>
                  <td className="py-4 px-6">{data["main no. text"]}</td>
                  <td className="py-4 px-6">{data.Class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>

      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                QR Code
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="flex justify-center">
              <div className="flex flex-col">
                <QRCodeSVG value={selectData} />
                <span>{selectData}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
