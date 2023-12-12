create Table users(
    id SERIAL PRIMARY KEY,
    login VARCHAR(255),
    password_hash VARCHAR(255),
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles (id)
);

create Table roles(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    privelege_id INTEGER,
    FOREIGN KEY (privelege_id) REFERENCES priveleges (id)
);

create Table priveleges(
    id SERIAL PRIMARY KEY,
    title VARCHAR
);

create Table catalog(
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255),
    product_type_id INTEGER,
    FOREIGN KEY (product_type_id) REFERENCES product_types (id),
    in_stoke BOOLEAN, 
    description VARCHAR(2000),
    price INTEGER,
    discount INTEGER,
    weight INTEGER,
    kcal INTEGER,
    main_image VARCHAR(255)
);

create Table product_types(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255)
);

-- INSERT INTO priveleges (title) VALUES ('catalog managment');
-- INSERT INTO roles (title, privelege_id) VALUES ('manager', 1);
-- INSERT INTO product_types (type) VALUES ('fish');