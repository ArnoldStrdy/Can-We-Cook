import { IExistingMenu } from "@/Types/RestaurantTypes";
import { Table } from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";

export const MenuTabContent = ({ menu }: { menu: IExistingMenu[] }) => {
  // console.log(menu);
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow className="text-lg">
          <TableHead className="text-center font-bold text-black w-1/3">
            Picture
          </TableHead>
          <TableHead className="text-center font-bold text-black w-1/3">
            Name
          </TableHead>
          <TableHead className="text-center font-bold text-black w-1/3">
            Price
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menu.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="w-[7%] p-0 text-center">
              <div className="flex justify-center items-center w-full h-full">
                {item.itemImage.length > 0 && (
                  <img
                    src={item.itemImage}
                    className="w-12 h-12 object-contain"
                    alt={item.itemID}
                  />
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <p className="text-base font-semibold">{item.itemName}</p>
            </TableCell>
            <TableCell className="text-center">
              <p className="text-base font-semibold">${item.itemPrice}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};