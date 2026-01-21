import z from "zod";

export const CreateProfile=z.object( {
  userId:z.string(),
  name: z.string(),
  DOB: z.coerce.date(),
  gender:z.enum(['male' , 'female' , 'other']),
  relationship: z.string(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  profilePic: z.string().url().optional(),
  isPrimary:z.boolean(),
});
export type CreateProfileDTO=z.infer<typeof CreateProfile> 


export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  statusCode: z.number(),
  data: z.any().optional(),
});
export type BaseResponseDTO = z.infer<typeof BaseResponseSchema>;

//profileResponse DTO
const createProfileResponse=z.object({
    userId:z.string(),
    name: z.string(),
    DOB: z.coerce.date(),
    gender:z.enum(['male' , 'female' , 'other']),
    relationship: z.string(),
    address:z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
    }), 
    location: z.object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()), 
    }).optional(), 
    profilePic: z.string().url().optional(),
     isPrimary:z.boolean(),
})
const ProfileResponse=BaseResponseSchema.extend ({data:createProfileResponse});
export type ProfileResponseDTO=z.infer< typeof ProfileResponse>;




const ProfileListItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  isPrimary:z.boolean(),
});

// 2. The Full Response Schema
export const AllProfilesResponseSchema = BaseResponseSchema.extend({
  data: z.array(ProfileListItemSchema) 
});
export  type AllProfileResponseDTO=z.infer<typeof AllProfilesResponseSchema>
    
