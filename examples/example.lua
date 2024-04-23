function fibonacii(n)
    if n == 0 then
        return 0
    elseif n == 1 then
        return 1
    else
        return fibonacii(n - 1) + fibonacii(n - 2)
    end
end

print(fibonacii(10))
