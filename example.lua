function add(a, b)
    return a + b;
end

if not (add(1, 2) == 3) then
    if (add(1, 10) >= 11) then
        print("add(1, 2) == 3 failed")
    else
        print("add(1, 10) == 11 failed")
    end
else
    print("add(1, 2) == 3 passed")
end
