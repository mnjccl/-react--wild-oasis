import supabase, { supabaseUrl } from "./supabase";

import { CabinData } from "../features/cabins/CabinTypes";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }

  return data;
}

export async function createEditCabin(newCabin: CabinData, id?: number) {
  const isFileImage = newCabin.image instanceof File;

  let imageName = "";
  let imagePath = newCabin.image;
  if (isFileImage) {
    imageName = `${Math.random()}-${(newCabin.image as File).name}`.replaceAll(
      "/",
      ""
    );

    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image as File);

    if (storageError) {
      console.error(storageError);
      throw new Error("Cabin image could not be uploaded.");
    }

    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  }

  let data, error;
  if (!id) {
    ({ data, error } = await supabase
      .from("cabins")
      .insert([{ ...newCabin, image: imagePath }]));
  } else {
    ({ data, error } = await supabase
      .from("cabins")
      .update({ ...newCabin, image: imagePath })
      .eq("id", id));
  }

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created or updated.");
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted.");
  }

  return data;
}
