
#include <iostream>
#include <vector>
#include <string>

##USER_CODE_HERE##

int main() {
int n1;
std::cin >> n1;
int n2;
std::cin >> n2;
unknownnum1;
num1.resize(n1, std::vector<list<string>>(n2));
for (auto& vec0 : num1) {
for (auto& vec1 : vec0) {
cin >> vec1;
}
}

std::cin >> k;
vector<int> result = Average(num1, k);
std::cout << result << std::endl;
return 0;
}
  