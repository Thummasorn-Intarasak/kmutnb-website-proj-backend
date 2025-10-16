-- สคริปต์สำหรับเพิ่มข้อมูลเกมทดสอบพร้อมรูป
-- รันคำสั่งนี้ใน PostgreSQL เพื่อเพิ่มข้อมูล
-- ลบข้อมูลเดิม (ถ้ามี)
TRUNCATE TABLE item RESTART IDENTITY CASCADE;
-- เพิ่มข้อมูลเกมพร้อมรูป
INSERT INTO item (
        game_name,
        game_description,
        game_price,
        game_image
    )
VALUES (
        'Cyberpunk 2077',
        'An open-world, action-adventure RPG set in the dark future of Night City.',
        1299.00,
        'uploads/images/game-1760583446676-933916044.jpg'
    ),
    (
        'The Witcher 3: Wild Hunt',
        'An award-winning open-world RPG featuring Geralt of Rivia in his quest to find Ciri.',
        799.00,
        'uploads/images/game-1760583446678-256657817.jpg'
    ),
    (
        'Red Dead Redemption 2',
        'An epic tale of outlaw Arthur Morgan and the Van der Linde gang.',
        1499.00,
        'uploads/images/game-1760583446681-648477320.png'
    ),
    (
        'Grand Theft Auto V',
        'Los Santos: a sprawling sun-soaked metropolis full of self-help gurus and starlets.',
        899.00,
        NULL
    ),
    (
        'Elden Ring',
        'A dark fantasy action RPG from FromSoftware and George R.R. Martin.',
        1799.00,
        NULL
    ),
    (
        'Hogwarts Legacy',
        'Experience Hogwarts in the 1800s and embark on your own magical adventure.',
        1599.00,
        NULL
    ),
    (
        'God of War',
        'Kratos and Atreus embark on a deeply personal journey in the realm of Norse gods.',
        1299.00,
        NULL
    ),
    (
        'Spider-Man Remastered',
        'Swing through Marvel\'s New York as the iconic Spider-Man.',
        1099.00,
        NULL
    );
-- ตรวจสอบข้อมูลที่เพิ่ม
SELECT *
FROM item
ORDER BY game_id;