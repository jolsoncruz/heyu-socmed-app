import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link , useNavigate} from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
  
  const { mutateAsync: createUserAccount, isPending : isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending : isSigningIn } = useSignInAccount();

  const onSubmit = async (user: z.infer<typeof SignUpValidation>) => {
    try{
      const newUser = await createUserAccount(user);
      
      if(!newUser){
        return toast({ title: "Sign-up failed. Please try again." });
      }
  
      const session = await signInAccount({
        email: user.email,
        password: user.password
      })
  
      if(!session){
        toast({ title: "Sign in failed. Please try again.", });
        navigate("/sign-in"); //advanced
        return;
      }
  
      const isLoggedIn = await checkAuthUser();
  
      if(isLoggedIn){
        form.reset();
        navigate('/')
      } else {
        toast({ title: 'Sign up failed. Please try again.'})
        return;
      }
    } catch (error) {
      console.log({error});
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="HayU Logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular">To use HeyU, please enter your details:</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Jolson Cruz" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="jcz.dev" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jcz@heyu.com" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <Button type="submit" className="shad-button_primary">
            { isCreatingAccount || isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2"><Loader />Loading...</div> ) :
              "Sign-up"}
              </Button>
              <p className="text-small-regular text-light-2 text-center mt-2">Already have an account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Login.</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm