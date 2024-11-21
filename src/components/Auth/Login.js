import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { TEInput, TERipple } from "tw-elements-react";
import { login } from '../../services/authService';
import { useAuth } from "./AuthContex";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log("Login successful:", data); // Handle successful login (e.g., storing token)
      localStorage.setItem('token', data.token);
      setError(null);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-700">
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                {/* Left column for login form */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="https://cdn.pixabay.com/photo/2020/11/29/07/06/aroma-5786653_640.png"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        Studio Masażu Bez i Agrest
                      </h4>
                    </div>

                    <form onSubmit={handleLogin}>
                      <p className="mb-4">Zaloguj się do swojego konta</p>
                  
                      <input
                        type="text"
                        label="Username"
                        placeholder="Nazwa"  // This shows "Username" as placeholder text
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full rounded border p-2 mb-4 bg-transparent text-neutral-800 dark:text-neutral-200 border-neutral-300 focus:border-blue-500"
                      />

                      <input
                        type="password"
                        label="Password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded border p-2 mb-4 bg-transparent text-neutral-800 dark:text-neutral-200 border-neutral-300 focus:border-blue-500"
                      />

                      <div className="mb-12 pb-1 pt-1 text-center">
                        <TERipple rippleColor="light" className="w-full">
                          <button
                            type="submit"
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                            style={{
                              background:
                                "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                            }}
                          >
                            Zaloguj
                          </button>
                        </TERipple>

                        <a href="/reset-password" className="text-sm text-neutral-500 dark:text-neutral-300">
                          Zapomniałeś hasła?
                        </a>
                      </div>

                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Nie masz Konta?</p>
                        <TERipple rippleColor="light">
                          <a
                             href="/register"
                            className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                          >
                            Załóż konto
                          </a>
                        </TERipple>
                      </div>
                    </form>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
                </div>

                {/* Right column with background and description */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                  style={{
                    background: "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      Najlepsze studio masażu w mieście
                    </h4>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
