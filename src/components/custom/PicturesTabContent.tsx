import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export const PicturesTabContent = ({
  pictures,
  onDelete,
}: {
  pictures: string[];
  onDelete?: (index: number) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-4">
    {pictures.map((url, index) => (
      <ClickablePicture
        url={url}
        index={index}
        onDelete={onDelete}
        big={true}
      />
    ))}
  </div>
);

export const ClickablePicture = ({
  url,
  onDelete,
  index,
  big,
}: {
  url: string;
  onDelete?: (index: number) => void;
  index?: number;
  big?: boolean;
}) => (
  <Dialog key={url}>
    <DialogTrigger asChild>
      <div className="rounded-md bg-black overflow-hidden aspect-square w-full flex items-center justify-center relative ">
        <div
          className={`bg-gray-100 hover:opacity-95 ${
            big ? "w-full" : "w-16"
          } h-full hover:cursor-pointer`}
        >
          <img
            src={url}
            className="aspect-square w-full rounded-md shadow object-contain"
          />
          {onDelete && (
            <button
              onClick={() => onDelete(index!)}
              className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:text-red-800"
            >
              <Trash2 />
            </button>
          )}
        </div>
      </div>
    </DialogTrigger>
    <DialogContent className="p-10">
      <img src={url} alt="" className="w-full h-auto object-contain" />
    </DialogContent>
  </Dialog>
);
