const queries = {
  createStudent: `
        INSERT INTO student(first_name, last_name, email, date_of_birth, hobbies, photo_url, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
   `,
};

module.exports = queries;
