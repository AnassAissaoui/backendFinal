const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const {login} = require("../controllers/userController");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/user")

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
  });

// Test de la route login
describe("Login", () => {
    it("should login an existing user and return a token", async () => {
      const req = {
        body: {
          email: "patrick@sebastien.com",
          password: "passe123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock de bcrypt.compare pour simuler la comparaison du mot de passe
      bcrypt.compare.mockResolvedValue(true);

      // Mock de la recherche de l'utilisateur dans MongoDB
      UserModel.findOne = jest.fn().mockResolvedValue({
        _id: "userId",
        role: "user",
      });

      // Mock de jwt.sign pour générer un token
      jwt.sign.mockReturnValue("token");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        userId: "userId",
        token: "token",
      });
    });

    it("should return an error if password is incorrect", async () => {
      const req = {
        body: {
          email: "pierre@belmondo.com",
          password: "mauvais",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock de bcrypt.compare pour simuler une erreur de mot de passe
      bcrypt.compare.mockResolvedValue(false);

      // Mock de la recherche de l'utilisateur
      UserModel.findOne = jest.fn().mockResolvedValue({
        _id: "userId",
        role: "user",
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Paire identifiant/mot de passe incorrecte",
      });
    });
  });
});
  
