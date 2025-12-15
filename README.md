<img width="1109" height="826" alt="image" src="https://github.com/user-attachments/assets/0825522f-9502-4c26-9fd0-386165214a18" />




Table Users {
  id integer [primary key]
  username varchar [unique, not null]
  email varchar [unique, not null]
  password varchar [not null]
  role_id integer [ref: > Roles.id]
}

Table Roles {
  id integer [primary key]
  name varchar [unique, not null] // 'admin', 'user'
}

Table Categories {
  id integer [primary key]
  name varchar [unique, not null]
  description text // الملخص او ال summary اللي بيتكتب
}

Table Books {
  id integer [primary key]
  title varchar [not null]
  author varchar [not null]
  description text
  price decimal(10,2) [not null]
  category_id integer [ref: > Categories.id]
  image_url varchar
}

Table Orders {
  id integer [primary key]
  user_id integer [ref: > Users.id, not null]
  status varchar [default: 'pending'] // 'pending', 'confirmed', 'delivered', 'cancelled'
  total_price decimal(10,2)
  shipping_address text
  payment_status varchar [default: 'unpaid'] // 'unpaid', 'paid'
}

Table Order_Items {
  id integer [primary key]
  order_id integer [ref: > Orders.id, not null]
  book_id integer [ref: > Books.id, not null]
  quantity integer [not null, default: 1]
  price decimal(10,2) [not null] // سعر الكتاب وقت الطلب
}

// الادمن يقدر يضيف/يعدل/يمسح كتب و يشوف كل الاوردرت و يعمل approved ليها
// اليوزر يقدر يشوف الكتب و يعمل orders
