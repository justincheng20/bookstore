process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

const book1 = {
  isbn: "0",
  amazon_url: "test.com",
  author: "TEST TESTER",
  language: "TESTISH",
  pages: 100,
  publisher: "TEST PUB",
  title: "TEST TITLE",
  year: 1,
};

const book2 = {
  isbn: "2",
  amazon_url: "test2.com",
  author: "TEST2 TESTER2",
  language: "TESTISH2",
  pages: 101,
  publisher: "TEST PUB2",
  title: "TEST TITLE2",
  year: 2,
};

describe("Book Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let response = await request(app)
      .post("/books/")
      .send(book1);

  });

  /** GET/users/ => all users  */

  describe("GET / books", function () {
    test("can see all books", async function () {
      let response = await request(app)
        .get("/books");

      expect(response.body).toEqual({ books: [book1] });
    });

    test("can see one book (book1) - by isbn", async function () {
      let response = await request(app)
        .get("/books/0");

      expect(response.body).toEqual({ book: book1 });
    });

    test("can't see one book - invalid isbn", async function () {
      let response = await request(app)
        .get("/books/invalid-isbn");

      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn 'invalid-isbn",
          status: 404
        }
      });
    });

    test("can add book2", async function () {
      let response = await request(app)
        .post("/books/")
        .send(book2);

      expect(response.body).toEqual({ book: book2 });
    });

    test("can't add book - invalid inputs", async function () {
      let response = await request(app)
        .post("/books/")
        .send({
          isbn: 0,
          amazon_url: 0,
          author: 0,
          language: 0,
          pages: "zero",
          publisher: 0,
          title: 0,
          year: "zero",
        });

      expect(response.body).toEqual({
        error: {
          message: [
            "instance.isbn is not of a type(s) string",
            "instance.amazon_url is not of a type(s) string",
            "instance.author is not of a type(s) string",
            "instance.language is not of a type(s) string",
            "instance.pages is not of a type(s) integer",
            "instance.publisher is not of a type(s) string",
            "instance.title is not of a type(s) string",
            "instance.year is not of a type(s) integer"
          ],
          status: 400
        }
      });
    });

    test("can't add book - no inputs", async function () {
      let response = await request(app)
        .post("/books/")
        .send({});

      expect(response.body).toEqual({
        error: {
          message: [
            "instance requires property \"isbn\"",
            "instance requires property \"amazon_url\"",
            "instance requires property \"author\"",
            "instance requires property \"language\"",
            "instance requires property \"pages\"",
            "instance requires property \"publisher\"",
            "instance requires property \"title\"",
            "instance requires property \"year\""
          ],
          status: 400
        }
      });
    });

    test("can update book1 to book2", async function () {
      let response = await request(app)
        .put("/books/0")
        .send(book2);

      expect(response.body).toEqual({
        book: {
          isbn: "0",
          amazon_url: "test2.com",
          author: "TEST2 TESTER2",
          language: "TESTISH2",
          pages: 101,
          publisher: "TEST PUB2",
          title: "TEST TITLE2",
          year: 2,
        }
      });
    });

    test("can't update book - invalid inputs", async function () {
      let response = await request(app)
        .put("/books/0")
        .send({
          amazon_url: 0,
          author: 0,
          language: 0,
          pages: "zero",
          publisher: 0,
          title: 0,
          year: "zero",
        });

      expect(response.body).toEqual({
        error: {
          message: [
            "instance.amazon_url is not of a type(s) string",
            "instance.author is not of a type(s) string",
            "instance.language is not of a type(s) string",
            "instance.pages is not of a type(s) integer",
            "instance.publisher is not of a type(s) string",
            "instance.title is not of a type(s) string",
            "instance.year is not of a type(s) integer"
          ],
          status: 400
        }
      });
    });

    test("can't update book - no inputs", async function () {
      let response = await request(app)
        .put("/books/0")
        .send({});

      expect(response.body).toEqual({
        error: {
          message: [
            "instance requires property \"amazon_url\"",
            "instance requires property \"author\"",
            "instance requires property \"language\"",
            "instance requires property \"pages\"",
            "instance requires property \"publisher\"",
            "instance requires property \"title\"",
            "instance requires property \"year\""
          ],
          status: 400
        }
      });
    });

    test("can't update book - invalid isbn", async function () {
      let response = await request(app)
        .put("/books/invalid-isbn")
        .send(book2);

      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn 'invalid-isbn",
          status: 404,
        }
      });
    });

    test("can delete book1", async function () {
      let response = await request(app)
        .delete("/books/0");

      expect(response.body).toEqual({ message: "Book deleted" });
    });

    test("can't delete book - invalid isbn", async function () {
      let response = await request(app)
        .delete("/books/invalid-isbn");

      expect(response.body).toEqual({
        error: {
          message: "There is no book with an isbn 'invalid-isbn",
          status: 404,
        }
      });
    });
  });
});

afterAll(async function () {
  await db.end();
});


