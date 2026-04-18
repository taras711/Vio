/**
 * User schema
 * @module core/users
 * @description This module contains the schema for the users module.
 */
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["admin", "user", "superadmin"]),
  permissions: z.array(z.string())
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "user", "superadmin"]).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});