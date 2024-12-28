count = 0
for _ in range(int(input())):
    if count == 0:
        input()
        count = 1
    a = int(input())
    b = int(input())
    temp = []
    for j in range(b):
        for i in range(1, a + 1):
            print(f"{i}" * (i))
        for i in range(a - 1, 0, -1):
            print(f"{i}" * i)
        print()