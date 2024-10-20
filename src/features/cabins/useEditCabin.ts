import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createEditCabin } from "../../services/apiCabins";
import { CabinData } from "./CabinTypes";

export function useEditCabin() {
  const queryClient = useQueryClient();

  interface EditCabinMutationArgs {
    newCabinData: CabinData;
    id: number;
  }

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: EditCabinMutationArgs) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error((err as Error).message),
  });
  return { editCabin, isEditing };
}
