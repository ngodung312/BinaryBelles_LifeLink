// import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { axiosInstance } from './axiosConfig';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(sessionStorage.getItem("user")) || null
	);


	const login = async (inputs) => {
		inputs["check_login"] = 1;

		return axiosInstance
            .post(`/v1/users/`, inputs)
            .then((res) => {
				console.log(res);
                setCurrentUser(res.data);
                return res;
            })
            .catch((err) => {
                return err;
            });
	};

	const register = async (inputs) => {
		inputs["check_login"] = 0;

		return axiosInstance
            .post("/v1/users", inputs)
            .then((res) => {
                setCurrentUser(res.data);
                return res;
            })
            .catch((err) => {
                return err;
            });
	};

	const logout = () => {
		setCurrentUser(null); 
	}

	useEffect(() => {
		sessionStorage.setItem("user", JSON.stringify(currentUser));
	}, [currentUser]);

	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};