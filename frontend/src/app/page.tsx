import { redirect } from 'next/navigation';

export default function Home() {
  // En el futuro: si el usuario no tiene JWT, dirigirá a /login
  redirect('/inbox');
}
