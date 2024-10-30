// 'use client'
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card-ui";
// import { Input } from "@/components/ui/shadcn/input-ui";
// import { Button } from "@/components/ui/shadcn/button-ui";
// import { Label } from "@/components/ui/shadcn/label-ui";
// import { Camera, Copy, Loader2, AlertTriangle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Alert, AlertDescription } from "@/components/ui/shadcn/alert-ui";
// import { motion, AnimatePresence } from "framer-motion";
// import * as z from "zod";

// // Animation variants
// const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         duration: 0.3
//       }
//     }
//   };
  
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut"
//       }
//     }
//   };
  
//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.3
//       }
//     }
//   };
  
//   const errorVariants = {
//     hidden: { opacity: 0, height: 0, marginTop: 0 },
//     visible: { 
//       opacity: 1, 
//       height: "auto", 
//       marginTop: "0.25rem",
//       transition: {
//         duration: 0.2
//       }
//     },
//     exit: {
//       opacity: 0,
//       height: 0,
//       marginTop: 0,
//       transition: {
//         duration: 0.2
//       }
//     }
//   };

// // Validation schema
// const socialSchema = z.object({
//   twitter: z.string().regex(/^@?(\w){1,15}$/, "Invalid Twitter username").optional(),
//   instagram: z.string().regex(/^@?(\w){1,30}$/, "Invalid Instagram username").optional(),
//   website: z.string().url("Invalid URL").optional(),
// });

// const userSchema = z.object({
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   username: z.string(),
//   publicKey: z.string(),
//   profileImage: z.any().optional(),
//   social: socialSchema,
// });

// // Error Boundary Component
// interface ErrorBoundaryState {
//   hasError: boolean;
//   error: any;
// }

// class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
//   constructor(props: React.PropsWithChildren<{}>) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: any) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: any, errorInfo: any) {
//     console.error('Error caught by boundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Alert variant="destructive" className="my-4">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             Something went wrong. Please try refreshing the page or contact support if the issue persists.
//           </AlertDescription>
//         </Alert>
//       );
//     }

//     return this.props.children;
//   }
// }

// // GraphQL mutation
// const UPDATE_USER = `
//   mutation UpdateUser($input: UpdateUserInput!) {
//     updateUser(input: $input) {
//       id
//       firstName
//       lastName
//       username
//       publicKey
//       social {
//         twitter
//         instagram
//         website
//       }
//     }
//   }
// `;

// const SettingsFeature = () => {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
//   // Initial form state
//   const [formData, setFormData] = useState({
//     firstName: "Matt",
//     lastName: "Weichel",
//     username: "67167299293c8076f0cbd0fe",
//     publicKey: "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n",
//     profileImage: null,
//     social: {
//       twitter: "",
//       instagram: "",
//       website: ""
//     }
//   });

//   // Validate single field
//   const validateField = (name: string | number, value: any) => {
//     try {
//       if (typeof name === 'string' && name.includes('.')) {
//         const [parent, child] = name.split('.');
//         const schema = parent === 'social' ? socialSchema : userSchema;
//         (schema.shape as any)[child].parse(value);
//       } else {
//         userSchema.shape[name as keyof typeof userSchema.shape].parse(value);
//       }
      
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         setValidationErrors(prev => ({
//           ...prev,
//           [name]: error.errors[0].message
//         }));
//       }
//     }
//   };

//   // Handle input changes
//   const handleChange = (e: { target: { name: string; value: any; }; }) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.') as [keyof typeof formData, keyof typeof formData['social']];
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...(typeof prev[parent] === 'object' && prev[parent] !== null ? prev[parent] : {}),
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }

//     validateField(name, value);
//   };

//   // Handle image upload
//   const handleImageUpload = (e: { target: { files: any[]; }; }) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setValidationErrors(prev => ({
//           ...prev,
//           profileImage: "Image size must be less than 5MB"
//         }));
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setValidationErrors(prev => ({
//           ...prev,
//           profileImage: "File must be an image"
//         }));
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         profileImage: file
//       }));
      
//       // Clear any previous errors
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.profileImage;
//         return newErrors;
//       });
//     }
//   };

//   // Handle copy to clipboard
//   const handleCopyClick = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast({
//         title: "Copied to clipboard",
//         duration: 2000
//       });
//     } catch (err) {
//       toast({
//         title: "Failed to copy",
//         variant: "destructive",
//         duration: 2000
//       });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Validate entire form
//       const validatedData = userSchema.parse(formData);

//       // Example GraphQL mutation call
//       const response = await fetch('/api/auth/graphql', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           query: UPDATE_USER,
//           variables: {
//             input: {
//               firstName: validatedData.firstName,
//               lastName: validatedData.lastName,
//               social: validatedData.social
//             }
//           }
//         })
//       });

//       const data = await response.json();

//       if (data.errors) {
//         throw new Error(data.errors[0].message);
//       }

//       toast({
//         title: "Profile updated successfully",
//         duration: 2000
//       });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const errors: { [key: string]: string } = {};
//         error.errors.forEach(err => {
//           errors[err.path.join('.')] = err.message;
//         });
//         setValidationErrors(errors);
        
//         toast({
//           title: "Validation Error",
//           description: "Please check the form for errors",
//           variant: "destructive",
//           duration: 3000
//         });
//       } else {
//         toast({
//           title: "Error updating profile",
//           description: (error as Error).message,
//           variant: "destructive",
//           duration: 3000
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderError = (fieldName: string) => {
//     return (
//       <AnimatePresence mode="wait">
//         {validationErrors[fieldName] && (
//           <motion.span
//             className="text-sm text-red-500 block"
//             variants={errorVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//           >
//             {validationErrors[fieldName]}
//           </motion.span>
//         )}
//       </AnimatePresence>
//     );
//   };

//   return (
//     <ErrorBoundary>
//       <motion.div 
//         className="w-full max-w-3xl mx-auto p-4 mt-20"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         <form onSubmit={handleSubmit}>
//           <motion.div variants={cardVariants}>
//             <Card className="w-full">
//               <CardHeader>
//                 <CardTitle>Edit Profile</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <motion.h3 
//                     variants={itemVariants} 
//                     className="text-lg font-medium"
//                   >
//                     Informations
//                   </motion.h3>
                  
//                   {/* Profile Image Upload */}
//                   <motion.div variants={itemVariants} className="space-y-2">
//                     <Label>Profile image</Label>
//                     <div className="flex items-start space-x-4">
//                       <motion.div 
//                         className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden"
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         {formData.profileImage ? (
//                           <motion.img 
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             src={URL.createObjectURL(formData.profileImage)} 
//                             alt="Profile preview" 
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <Camera className="w-8 h-8 text-gray-400" />
//                         )}
//                       </motion.div>
//                       <div className="space-y-1">
//                         <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                           <Button 
//                             variant="outline" 
//                             size="sm" 
//                             type="button" 
//                             onClick={() => document.getElementById('profileImage')?.click()}
//                           >
//                             Upload picture
//                           </Button>
//                         </motion.div>
//                         <input
//                           id="profileImage"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                         //   onChange={handleImageUpload}
//                         />
//                         <p className="text-sm text-gray-500">
//                           Max size: 5MB. Supported formats: JPEG, PNG
//                         </p>
//                         {renderError('profileImage')}
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* Full Name */}
//                   <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="firstName">First name</Label>
//                       <Input 
//                         id="firstName"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="Enter your first name"
//                         className={validationErrors.firstName ? "border-red-500" : ""}
//                       />
//                       {renderError('firstName')}
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="lastName">Last name</Label>
//                       <Input 
//                         id="lastName"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Enter your last name"
//                         className={validationErrors.lastName ? "border-red-500" : ""}
//                       />
//                       {renderError('lastName')}
//                     </div>
//                   </motion.div>

//                   {/* Username */}
//                   <motion.div variants={itemVariants} className="space-y-2">
//                     <Label htmlFor="username">Username</Label>
//                     <div className="flex space-x-2">
//                       <Input 
//                         id="username"
//                         value={formData.username}
//                         readOnly
//                         className="flex-1"
//                       />
//                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <Button 
//                           type="button"
//                           variant="outline" 
//                           size="icon"
//                           onClick={() => handleCopyClick(formData.username)}
//                         >
//                           <Copy className="w-4 h-4" />
//                         </Button>
//                       </motion.div>
//                     </div>
//                   </motion.div>

//                   {/* Public Key */}
//                   <motion.div variants={itemVariants} className="space-y-2">
//                     <Label htmlFor="publicKey">Public Key</Label>
//                     <div className="flex space-x-2">
//                       <Input 
//                         id="publicKey"
//                         value={formData.publicKey}
//                         readOnly
//                         className="flex-1"
//                       />
//                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <Button 
//                           type="button"
//                           variant="outline" 
//                           size="icon"
//                           onClick={() => handleCopyClick(formData.publicKey)}
//                         >
//                           <Copy className="w-4 h-4" />
//                         </Button>
//                       </motion.div>
//                     </div>
//                   </motion.div>

//                   {/* Social Links */}
//                   <motion.div variants={itemVariants} className="space-y-4">
//                     <h3 className="text-lg font-medium">Social links</h3>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="twitter">X (Twitter)</Label>
//                       <Input 
//                         id="twitter"
//                         name="social.twitter"
//                         value={formData.social.twitter}
//                         onChange={handleChange}
//                         placeholder="@username"
//                         className={validationErrors['social.twitter'] ? "border-red-500" : ""}
//                       />
//                       {renderError('social.twitter')}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="instagram">Instagram</Label>
//                       <Input 
//                         id="instagram"
//                         name="social.instagram"
//                         value={formData.social.instagram}
//                         onChange={handleChange}
//                         placeholder="@username"
//                         className={validationErrors['social.instagram'] ? "border-red-500" : ""}
//                       />
//                       {renderError('social.instagram')}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="website">Website URL</Label>
//                       <Input 
//                         id="website"
//                         name="social.website"
//                         value={formData.social.website}
//                         onChange={handleChange}
//                         placeholder="https://mywebsite.com"
//                         className={validationErrors['social.website'] ? "border-red-500" : ""}
//                       />
//                       {renderError('social.website')}
//                     </div>
//                   </motion.div>
//                 </div>

//                 <motion.div 
//                   variants={itemVariants}
//                   className="flex justify-end pt-4"
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Button 
//                       type="submit" 
//                       disabled={isLoading || Object.keys(validationErrors).length > 0}
//                     >
//                       {isLoading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Updating...
//                         </>
//                       ) : (
//                         "Update my informations"
//                       )}
//                     </Button>
//                   </motion.div>
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </form>
//       </motion.div>
//     </ErrorBoundary>
//   );    
// };

// export default SettingsFeature;

'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card-ui";
import { Input } from "@/components/ui/shadcn/input-ui";
import { Button } from "@/components/ui/shadcn/button-ui";
import { Label } from "@/components/ui/shadcn/label-ui";
import { Camera, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/shadcn/alert-ui";
import { motion, AnimatePresence } from "framer-motion";
import * as z from "zod";

// Animation variants remain the same
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    marginTop: "0.25rem",
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Updated Validation schema
const socialSchema = z.object({
  twitter: z.string().regex(/^@?(\w){1,15}$/, "Invalid Twitter username").optional(),
  instagram: z.string().regex(/^@?(\w){1,30}$/, "Invalid Instagram username").optional(),
  website: z.string().url("Invalid URL").optional(),
});

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  social: socialSchema,
  baseProfile: z.object({
    displayName: z.string().optional(),
    displayRole: z.string().optional(),
    bio: z.string().optional(),
    photoUrl: z.string().optional(),
  }),
  investorInfo: z.object({
    investmentPreferences: z.array(z.string()).optional(),
    investmentHistory: z.array(z.string()).optional(),
    riskTolerance: z.string().optional(),
    preferredInvestmentDuration: z.string().optional(),
  })
});

// Error Boundary Component remains the same
interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// GraphQL mutation
const UPDATE_USER = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      firstName
      lastName
      country
      phoneNumber
      social {
        twitter
        instagram
        website
      }
      baseProfile {
        displayName
        displayRole
        bio
      }
      investorInfo {
        investmentPreferences
        investmentHistory
        riskTolerance
        preferredInvestmentDuration
      }
    }
  }
`;

const SettingsFeature = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  // Initial form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    phoneNumber: "",
    social: {
      twitter: "",
      instagram: "",
      website: ""
    },
    baseProfile: {
      displayName: "",
      displayRole: "",
      bio: "",
      photoUrl: "",
    },
    investorInfo: {
      investmentPreferences: [],
      investmentHistory: [],
      riskTolerance: "",
      preferredInvestmentDuration: "",
    }
  });

  // Validate single field
  const validateField = (name: string | number, value: any) => {
    try {
      if (typeof name === 'string' && name.includes('.')) {
        const [parent, child] = name.split('.');
        const schema = parent === 'social' ? socialSchema : userSchema;
        (schema.shape as any)[child].parse(value);
      } else {
        userSchema.shape[name as keyof typeof userSchema.shape].parse(value);
      }
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message
        }));
      }
    }
  };

  // Handle input changes
  const handleChange = (e: { target: { name: string; value: any; }; }) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof typeof formData, keyof typeof formData['social']];
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent] === 'object' && prev[parent] !== null ? prev[parent] : {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    validateField(name, value);
  };

  // Handle image upload
  const handleImageUpload = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          profileImage: "Image size must be less than 5MB"
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors(prev => ({
          ...prev,
          profileImage: "File must be an image"
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Clear any previous errors
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profileImage;
        return newErrors;
      });
    }
  };

  // Handle copy to clipboard
  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        duration: 2000
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
        duration: 2000
      });
    }
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = userSchema.parse(formData);

      const response = await fetch('/api/auth/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_USER,
          variables: {
            input: validatedData
          }
        })
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast({
        title: "Profile updated successfully",
        duration: 2000
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          errors[err.path.join('.')] = err.message;
        });
        setValidationErrors(errors);
        
        toast({
          title: "Validation Error",
          description: "Please check the form for errors",
          variant: "destructive",
          duration: 3000
        });
      } else {
        toast({
          title: "Error updating profile",
          description: (error as Error).message,
          variant: "destructive",
          duration: 3000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div 
        className="w-full max-w-3xl mx-auto p-4 mt-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <form onSubmit={handleSubmit}>
          <motion.div variants={cardVariants}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Profile Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName"
                      name="baseProfile.displayName"
                      value={formData.baseProfile.displayName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayRole">Display Role</Label>
                    <Input 
                      id="displayRole"
                      name="baseProfile.displayRole"
                      value={formData.baseProfile.displayRole}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio"
                      name="baseProfile.bio"
                      value={formData.baseProfile.bio}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X (Twitter)</Label>
                    <Input 
                      id="twitter"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      name="social.website"
                      value={formData.social.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </motion.div>

                {/* Investor Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Investor Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Input 
                      id="riskTolerance"
                      name="investorInfo.riskTolerance"
                      value={formData.investorInfo.riskTolerance}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredInvestmentDuration">Preferred Investment Duration</Label>
                    <Input 
                      id="preferredInvestmentDuration"
                      name="investorInfo.preferredInvestmentDuration"
                      value={formData.investorInfo.preferredInvestmentDuration}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading || Object.keys(validationErrors).length > 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </form>
      </motion.div>
    </ErrorBoundary>
  );
};

export default SettingsFeature;