import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  password: Yup.string().required("Required"),
  rememberMe: Yup.boolean(),
  username: Yup.string().required("Required"),
});
