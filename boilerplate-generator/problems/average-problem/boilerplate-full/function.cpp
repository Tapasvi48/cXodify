
#include <iostream>
#include <vector>
#include <string>

##USER_CODE_HERE##

int main() {
int n1;
std::cin >> n1;
std::vector<bool>(n1,true)num1;
for (auto& vec0 : num1) {
cin >> vec0;
}

vector<int> result = Average(num1);
std::cout << result << std::endl;
return 0;
}
  