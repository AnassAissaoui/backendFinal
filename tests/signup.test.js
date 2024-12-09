const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const {signup} = require("../controllers/userController");

jest.mock("bcrypt");
jest.mock("../models/user")

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
  });

  // Test de la route signup
  describe("Signup", () => {
    it("should create a new user and return a success message", async () => {
      const req = {
        body: {
          pseudo: "testuser",
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock de bcrypt.hash pour simuler le hachage du mot de passe
      bcrypt.hash.mockResolvedValue("hashedpassword");

      // Mock de la création de l'utilisateur dans MongoDB
      UserModel.prototype.save = jest.fn().mockResolvedValue({});

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec l'adresse suivante : test@example.com",
      });
    });

    it("should return an error if password hashing fails", async () => {
      const error = new Error("error")
      const req = {
        body: {
          pseudo: "testuser",
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.hash.mockRejectedValue(error);

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Une erreur s'est produite lors de la création de l'utilisateur",
        err: expect.any(Error),
      });
    });
  });
});
