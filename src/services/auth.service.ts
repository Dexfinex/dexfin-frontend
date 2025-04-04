import { userAuthApi } from "./api.service.ts";

// Custom error interface to allow the 'original' property
interface EnhancedError extends Error {
  original?: any;
}

export const authService = {
  login: async (walletAddress: string) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }

      const response = await userAuthApi.post("/login", {
        walletAddress,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error login wallet:", error);

      // Format error message for UI
      const errorMessage =
        error.response?.data?.message || "Failed to login with wallet";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  completeTwoFactorLogin: async (token: string) => {
    try {
      const response = await userAuthApi.post("/gauth/verify", {
        token,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error verifying 2FA:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to verify 2FA code";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  checkCode: async (code: string) => {
    try {
      if (!code) {
        throw new Error("Invitation code is required");
      }

      console.log("Sending invitation code:", code);

      const response = await userAuthApi.post("/verify-invitation", {
        invitationCode: code,
      });

      console.log("Response from server:", response);
      return response.data;
    } catch (error: any) {
      console.error("Error checking invitation code:", error);

      // Extract the error message from the server response
      const errorMessage =
        error.response?.data?.message || "Failed to verify invitation code";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  checkUsername: async (username: string) => {
    try {
      if (!username) {
        throw new Error("Username is required");
      }

      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
      }

      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username can only contain letters, numbers, and underscores"
        );
      }

      console.log("Checking username availability:", username);

      const response = await userAuthApi.post("/verify-username", {
        username: username,
      });

      console.log("Username check response:", response);

      return response.data;
    } catch (error: any) {
      console.error("Error checking username:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to check username availability";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  getUserName: async () => {
    try {
      const response = await userAuthApi.get("/check-username");
      console.log("Username check response:", response.data);

      if (response.data === false) {
        return false;
      }

      if (response.data && response.data.hasUsername === true) {
        return {
          hasUsername: true,
          username: response.data.username,
        };
      }

      return false;
    } catch (error: any) {
      console.error("Error checking username:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to check username";
      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  register: async (
    walletType: string,
    evmAddress?: string,
    solAddress?: string,
    btcAddress?: string
  ) => {
    console.log("New Registeration");
    try {
      if (!walletType) {
        throw new Error("Wallet type is required");
      }

      if (!evmAddress && !solAddress && !btcAddress) {
        throw new Error("At least one wallet address is required");
      }

      // Validate EVM address format
      if (evmAddress && !evmAddress.startsWith("0x")) {
        throw new Error("EVM address must start with 0x");
      }

      const response = await userAuthApi.post("/register", {
        evmAddress,
        solAddress,
        btcAddress,
        walletType,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error registering wallet:", error);

      // Format error message for UI
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to register wallet";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  registerUsername: async (username: string, referralCode?: string) => {
    try {
      if (!username || username.trim() === "") {
        throw new Error("Username is required");
      }

      // Validate username format (letters, numbers, underscores, hyphens only)
      const usernameRegex = /^[A-Za-z0-9_-]+$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username can only contain letters, numbers, underscores and hyphens"
        );
      }

      const payload = {
        username,
        referralCode: referralCode || "",
      };

      const { data } = await userAuthApi.post("/registerUserName", payload);

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data;
    } catch (error: any) {
      console.error("Error registering username:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });

      // Properly extract error message from response if available
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  getNonce: async (walletAddress: string) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }

      const response = await userAuthApi.post(`/nonce`, { walletAddress });

      return response.data;
    } catch (error: any) {
      console.error("Error get nonce:", error);

      // Format error message for UI
      const errorMessage =
        error.response?.data?.message || "Failed to get nonce";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  loginBySign: async (
    walletAddress: string,
    signature: string,
    nonce: string
  ) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }

      const response = await userAuthApi.post(`/loginBySign`, {
        walletAddress,
        signature,
        nonce,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error loginBySign:", error);

      // Format error message for UI
      const errorMessage =
        error.response?.data?.message || "Failed to loginBySign";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },

  registerBySign: async (
    walletAddress: string,
    signature: string,
    nonce: string
  ) => {
    try {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }

      const response = await userAuthApi.post(`/registerBySign`, {
        walletAddress,
        signature,
        nonce,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error registerBySign:", error);

      // Format error message for UI
      const errorMessage =
        error.response?.data?.message || "Failed to registerBySign";

      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.original = error;
      throw enhancedError;
    }
  },
};
