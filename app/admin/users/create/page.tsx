// "use client";

import CreateUserForm from "../_components/CreateUserForm";

// import { useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Camera, Loader2, X } from "lucide-react";
// import { toast } from "sonner";

// const userSchema = z.object({
//   fullname: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters").optional(),
//   role: z.enum(["customer", "provider", "admin"]),
//   phone: z.string().optional(),
// });

// type UserFormData = z.infer<typeof userSchema>;

// interface CreateUserFormProps {
//   initialData?: any;
//   isEdit?: boolean;
// }

// export default function CreateUserForm({ initialData, isEdit = false }: CreateUserFormProps) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(
//     initialData?.imageUrl || null
//   );
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<UserFormData>({
//     resolver: zodResolver(userSchema),
//     defaultValues: {
//       fullname: initialData?.fullname || "",
//       email: initialData?.email || "",
//       role: initialData?.role || "customer",
//       phone: initialData?.phone || "",
//     },
//   });

//   const selectedRole = watch("role");

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setProfileImage(null);
//     setImageFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const onSubmit = async (data: UserFormData) => {
//     try {
//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("fullname", data.fullname);
//       formData.append("email", data.email);
//       formData.append("role", data.role);
      
//       if (data.password) {
//         formData.append("password", data.password);
//       }
//       if (data.phone) {
//         formData.append("phone", data.phone);
//       }
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       // Simulating API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       toast.success(
//         isEdit ? "User updated successfully!" : "User created successfully!"
//       );
//       router.push("/admin/users");
//     } catch (error: any) {
//       console.error("Error saving user:", error);
//       toast.error(error.message || "Failed to save user");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getInitials = () => {
//     const name = watch("fullname");
//     if (!name) return "U";
//     const names = name.split(" ");
//     return names.length > 1
//       ? `${names[0][0]}${names[1][0]}`.toUpperCase()
//       : names[0][0].toUpperCase();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>{isEdit ? "Edit User" : "Create New User"}</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Profile Picture */}
//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <Avatar className="h-24 w-24">
//                 <AvatarImage src={profileImage || undefined} />
//                 <AvatarFallback className="text-2xl bg-[#EE7A40] text-white">
//                   {getInitials()}
//                 </AvatarFallback>
//               </Avatar>
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="absolute -bottom-1 -right-1 bg-[#1e293b] hover:bg-[#334155] text-white rounded-full p-2 shadow-lg transition-all"
//               >
//                 <Camera className="w-4 h-4" />
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm font-medium">Profile Picture</p>
//               <p className="text-xs text-gray-500">JPG or PNG (max. 5MB)</p>
//               {profileImage && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleRemoveImage}
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Remove
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Full Name */}
//           <div className="space-y-2">
//             <Label htmlFor="fullname">
//               Full Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="fullname"
//               {...register("fullname")}
//               placeholder="John Doe"
//             />
//             {errors.fullname && (
//               <p className="text-xs text-red-600">{errors.fullname.message}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <Label htmlFor="email">
//               Email <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               {...register("email")}
//               placeholder="john@example.com"
//             />
//             {errors.email && (
//               <p className="text-xs text-red-600">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           {!isEdit && (
//             <div className="space-y-2">
//               <Label htmlFor="password">
//                 Password <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 {...register("password")}
//                 placeholder="••••••••"
//               />
//               {errors.password && (
//                 <p className="text-xs text-red-600">{errors.password.message}</p>
//               )}
//             </div>
//           )}

//           {/* Role */}
//           <div className="space-y-2">
//             <Label htmlFor="role">
//               Role <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={selectedRole}
//               onValueChange={(value) => setValue("role", value as any)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="customer">Customer</SelectItem>
//                 <SelectItem value="provider">Service Provider</SelectItem>
//               </SelectContent>
//             </Select>
//             {errors.role && (
//               <p className="text-xs text-red-600">{errors.role.message}</p>
//             )}
//           </div>

//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex items-center justify-end gap-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => router.push("/admin/users")}
//           disabled={isLoading}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={isLoading}
//           className="bg-[#EE7A40] hover:bg-[#d66a35]"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               {isEdit ? "Updating..." : "Creating..."}
//             </>
//           ) : (
//             <>{isEdit ? "Update User" : "Create User"}</>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }
export default function Page() {
    return (
        <div>
            <CreateUserForm/>
        </div>
    );
}