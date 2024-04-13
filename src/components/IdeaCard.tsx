import api from "@/lib/api";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";
interface IdeaCardProps {
  img: string;
  text: string;
  id: string;
  triggerFetch: () => void;
}

const IdeaCard = ({ img, text, id, triggerFetch }: IdeaCardProps) => {
  const [loading, setLoading] = useState(true);
  const handleDelete = async () => {
    // Handle deletion logic here
    console.log("Delete clicked for image:", img);
    try {
      const response = await api.delete(
        `/ideas/delete-idea-by-id?ideaId=${id}`
      );
      if (response.status === 200) {
        console.log("Idea deleted successfully");
        setLoading(true);
        triggerFetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Change the timeout in production
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="max-w-sm max-h-96 rounded overflow-hidden shadow-lg border relative hover:cursor-pointer">
      {/* Trash Icon */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <Trash
              size={30}
              color="white"
              cursor="pointer"
              className="bg-red-500 p-2 rounded-xl"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea?</AlertDialogTitle>
            <AlertDialogDescription>
              {"Are you sure to delete this idea?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-900" onClick={handleDelete}>
              Delete Idea
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image */}
      <div className="flex justify-center">
        <div className="h-[50%] w-[50%] object-cover  px-5 py-5 bg-transparent">
          {loading ? (
            <Skeleton className="w-40 h-40 rounded-full" />
          ) : (
            <img
              className="w-full object-cover"
              src={img}
              alt={img}
              height={50}
              width={50}
            />
          )}
        </div>
      </div>

      {/* Text */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex flex-col justify-around items-start">
            <Skeleton className="w-[100%] h-5 rounded-xl m-1" />
            <Skeleton className="w-[95%] h-5 rounded-xl m-1" />
            <Skeleton className="w-[90%] h-5 rounded-xl m-1" />
          </div>
        ) : (
          <p className="text-gray-700 text-base line-clamp-6 text-pretty dark:text-white">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
