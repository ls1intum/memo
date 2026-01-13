package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CreateUserRequest;
import de.tum.cit.memo.dto.UpdateUserRequest;
import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.exception.ResourceAlreadyExistsException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.UserRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User with this email already exists");
        }

        User user = User.builder()
            .id(IdGenerator.generateCuid())
            .name(request.getName())
            .email(request.getEmail())
            .role(request.getRole() != null ? request.getRole() : UserRole.USER)
            .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(String id, UpdateUserRequest request) {
        User user = getUserById(id);

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
