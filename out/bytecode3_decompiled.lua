function add(R0, R1)
	local R2 = R0 + R1

	return R2
end
function R0()
	local R2 = R0 + R1

	return R2
end

local add = R0
local R0 = add
local R1 = 1
local R2 = 2
local R0 = R0(R1, R2)

if R0 == 3 then
	local R0 = add
	local R1 = 1
	local R2 = 10
	local R0 = R0(R1, R2)
	local R1 = 11

	if not(R1 <= 0) then
		local R1 = "add(1, 2) == 3 failed"
		R0(R1)

		return 
	end

	local R1 = "add(1, 10) == 11 failed"
	R0(R1)

	return 
end

local R1 = "add(1, 2) == 3 passed"
R0(R1)

return 