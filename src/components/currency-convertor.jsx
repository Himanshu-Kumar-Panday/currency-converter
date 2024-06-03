import { useEffect, useState } from "react";
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { FaCopyright } from "react-icons/fa";
import '../currency-convertor.css'

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " ");
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency((prevFromCurrency) => {
      const newFromCurrency = toCurrency;
      setToCurrency(prevFromCurrency);
      return newFromCurrency;
    });
  };

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  return (
    <div className="max-w-xl mx-auto my-6 p-5 border-3 bg-gray-900 rounded-md h-2/5 ">
      <div className="max-w-xl mx-auto my-8 p-6 bg-gray-200 rounded-lg shadow-md">
        <h2 className="mb-5 text-2xl font-semibold text-gray-700 text-center">
          Currency Converter
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <CurrencyDropdown
            favorites={favorites}
            currencies={currencies}
            title="From:"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            handleFavorite={handleFavorite}
          />
          <div className="flex justify-center -mb-5 sm:mb-0">
            <button
              onClick={swapCurrencies}
              className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
            >
              <HiArrowsRightLeft className="text-xl text-gray-700" />
            </button>
          </div>
          <CurrencyDropdown
            favorites={favorites}
            currencies={currencies}
            currency={toCurrency}
            setCurrency={setToCurrency}
            title="To:"
            handleFavorite={handleFavorite}
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount:
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="convertedAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Converted Amount:
          </label>
          <input
            value={convertedAmount}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={convertCurrency}
            type="button"
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Convert
          </button>
        </div>
      </div>
      <footer className="text-center">
  <p className="text-white text-sm mt-4 inline-flex items-center space-x-1">
    2024&nbsp;&nbsp;<FaCopyright />&nbsp;&nbsp;Made By <b className="text-red-600">Rohan Godha</b>&nbsp;and <b className="text-red-600">Himanshu Kumar Panday</b>
  </p>
</footer>

    </div>
  );
};

export default CurrencyConverter;
